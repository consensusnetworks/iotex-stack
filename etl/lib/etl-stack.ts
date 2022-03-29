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

    // Todo rename variables and values and move to env

    const client = "IotexEtl";
    const stage = "Dev";

    // Todo decide mapping of various resources to events (i.e., how many topics should we use?)

    const topic = new sns.Topic(this, `${client}Topic${stage}`, {
      topicName: `${client}Topic${stage}`,
    });

    const deadLetterQueue = new sqs.Queue(this, `${client}DeadLetterQueue${stage}`);

    const topicLambda = new lambda.Function(this, `${client}TopicLambda${stage}`, {
      runtime: lambda.Runtime.NODEJS_14_X,
      handler: 'index.handler',
      code: lambda.Code.fromAsset('topic-lambda')
    });

    topicLambda.addEventSource(new SnsEventSource(topic, {
      filterPolicy: {},
      deadLetterQueue: deadLetterQueue,
    }));

    const bucket = new s3.Bucket(this, `${client}Bucket${stage}`);

    const bucketLambda = new lambda.Function(this, `${client}BucketLambda${stage}`, {
      runtime: lambda.Runtime.NODEJS_14_X,
      handler: 'index.handler',
      code: lambda.Code.fromAsset('bucket-lambda')
    })

    bucketLambda.addEventSource(new S3EventSource(bucket, {
      events: [s3.EventType.OBJECT_CREATED],
      filters: [
        { prefix: 'data/', }
      ]
    }));

    // Todo add Athena and Glue (query/aggregate stage) resources here
  }
}
