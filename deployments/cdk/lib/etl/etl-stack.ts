import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as sns from 'aws-cdk-lib/aws-sns';
import { SnsEventSource, S3EventSource } from 'aws-cdk-lib/aws-lambda-event-sources';

export class EtlStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const stackName = Stack.of(this).stackName;
    const project = process.env.PROJECT?.replace(/\b\w/g, c => c.toUpperCase());
    const stage = process.env.STAGE?.replace(/\b\w/g, c => c.toUpperCase());
    const service = "Etl";

    // Todo decide mapping of various resources to events (i.e., how many topics should we use?)

    const topic = new sns.Topic(this, `${project}${service}Topic${stage}`, {
      topicName: `${project}${service}Topic${stage}`,
    });

    const deadLetterQueue = new sqs.Queue(this, `${project}${service}DeadLetterQueue${stage}`);

    const topicLambda = new lambda.Function(this, `${project}${service}SnsLambda${stage}`, {
      runtime: lambda.Runtime.NODEJS_14_X,
      handler: 'index.handler',
      code: lambda.Code.fromAsset('../../services/sns-lambda')
    });

    topicLambda.addEventSource(new SnsEventSource(topic, {
      filterPolicy: {},
      deadLetterQueue: deadLetterQueue,
    }));

    const bucket = new s3.Bucket(this, `${project}${service}Bucket${stage}`);

    const processorLambda = new lambda.Function(this, `${project}${service}processorLambda${stage}`, {
      runtime: lambda.Runtime.NODEJS_14_X,
      handler: 'index.handler',
      code: lambda.Code.fromAsset('../../services/processor-lambda')
    })

    processorLambda.addEventSource(new S3EventSource(bucket, {
      events: [s3.EventType.OBJECT_CREATED],
      filters: [
        { prefix: 'data/', }
      ]
    }));

    // Todo add Athena and Glue (query/aggregate stage) resources here
  }
}
