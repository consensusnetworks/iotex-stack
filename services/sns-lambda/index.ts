import { SNSEvent } from "aws-lambda";

export const handler = (event: SNSEvent) => {
  console.log(JSON.stringify(event.Records));
  return {
    statusCode: 200,
    body: JSON.stringify({
      message:
        "Hello from SNS Lambda! This is the event: " + JSON.stringify(event.Records),
    }),
  };
};
