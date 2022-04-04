import { S3Event } from "aws-lambda";

export const handler = (event: S3Event) => {
  console.log(JSON.stringify(event.Records));
  return {
    statusCode: 200,
    body: {
      message:
        "Hello from S3 Lambda! This is the event: " + JSON.stringify(event.Records),
    },
  };
};