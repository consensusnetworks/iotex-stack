import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as s3 from 'aws-cdk-lib/aws-s3';
// import * as glue from 'aws-cdk-lib/aws-glue';
import * as glue from '@aws-cdk/aws-glue-alpha';
import { S3EventSource } from 'aws-cdk-lib/aws-lambda-event-sources';

export class EtlStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // const stackName = Stack.of(this).stackName;
    const project = process.env.PROJECT?.replace(/\b\w/g, c => c.toUpperCase());
    const stage = process.env.STAGE?.replace(/\b\w/g, c => c.toUpperCase());
    const service = "Etl";

    const database = new glue.Database(this, `${project}${service}Database${stage}`, {
      databaseName: `${project}${service}Database${stage}`,
    });

    const eventBucket = new s3.Bucket(this, `${project}${service}EventBucket${stage}`);
    
    new glue.Table(this, `${project}${service}EventTable${stage}`, {
      database: database,
      tableName: `${project}${service}EventTable${stage}`,
      bucket: eventBucket,
      columns: [
        {
          name: "timestamp",
          type: glue.Schema.STRING
        },
        {
          name: "address",
          type: glue.Schema.STRING
        },
        {
          name: "event_type",
          type: glue.Schema.STRING
        },
        {
          name: "staked_amount",
          type: glue.Schema.STRING
        },
        {
          name: "staked_duration",
          type: glue.Schema.STRING
        },
        {
          name: "auto_stake",
          type: glue.Schema.STRING
        },
      ],
      dataFormat: glue.DataFormat.JSON,
    });

    const processor = new lambda.Function(this, `${project}${service}Processor${stage}`, {
      runtime: lambda.Runtime.NODEJS_14_X,
      handler: 'index.handler',
      code: lambda.Code.fromAsset('../../services/processor')
    })

    processor.addEventSource(new S3EventSource(eventBucket, {
      events: [s3.EventType.OBJECT_CREATED]
    }));
  }
}
