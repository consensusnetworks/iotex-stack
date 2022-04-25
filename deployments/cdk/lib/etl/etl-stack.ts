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

    const databaseName = `${project}_${service}_Database_${stage}`
    const database = new glue.Database(this, `${project}${service}Database${stage}`, {
      databaseName: databaseName.toLowerCase(),
    });

    const eventBucket = new s3.Bucket(this, `${project}${service}EventBucket${stage}`);
    const aggBucket = new s3.Bucket(this, `${project}${service}AggBucket${stage}`);  
  
    const eventTableName = `${project}_${service}_Event_Table_${stage}`
    new glue.Table(this, `${project}${service}EventTable${stage}`, {
      database: database,
      tableName: eventTableName.toLowerCase(),
      bucket: eventBucket,
      columns: [
        {
          name: "type",
          type: glue.Schema.STRING,
          comment: "The type of event"
        },
        {
          name: "from_address",
          type: glue.Schema.STRING,
          comment: "The address that initiated the event"
        },
        {
          name: "to_address",
          type: glue.Schema.STRING,
          comment: "The address that received the event"
        },
        {
          name: "datestring",
          type: glue.Schema.STRING,
          comment: "The datestring (MM-DD-YYYY) of the event"
        },
        {
          name: "staked_amount",
          type: glue.Schema.STRING,
          comment: "The amount staked or unstaked in the stake action event"
        },
        {
          name: "staked_duration",
          type: glue.Schema.STRING,
          comment: "The duration of the stake action event"
        },
        {
          name: "auto_stake",
          type: glue.Schema.BOOLEAN,
          comment: "The compounding selection of the stake action event"
        },
      ],
      dataFormat: glue.DataFormat.JSON,
    });

    const aggTableName = `${project}_${service}_Agg_Table_${stage}`
    new glue.Table(this, `${project}${service}AggTable${stage}`, {
      database: database,
      tableName: aggTableName.toLowerCase(),
      bucket: aggBucket,
      columns: [
        {
          name: "type",
          type: glue.Schema.STRING,
          comment: "The type of aggregate (e.g. wallet, contract, etc.)"
        },
        {
          name: "address",
          type: glue.Schema.STRING,
          comment: "The address of the aggregate"
        },
        {
          name: "first_staked_at",
          type: glue.Schema.STRING,
          comment: "The first datestring (MM-DD-YYYY) that a wallet staked"
        },
        {
          name: "total_staked_amount",
          type: glue.Schema.STRING,
          comment: "The total amount that a wallet has staked"
        },
        {
          name: "total_staked_duration",
          type: glue.Schema.STRING,
          comment: "The total duration that a wallet has staked"
        },
        {
          name: "is_auto_stake",
          type: glue.Schema.STRING,
          comment: "The most recent stake reward compounding selection of a wallet"
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
