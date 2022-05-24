import { S3Event } from "aws-lambda"

export const handler = (event: S3Event) => {
  console.log(JSON.stringify(event.Records))
  const response = {
    statusCode: 200,
    body: "Hello from S3 Lambda! This is the event: " + JSON.stringify(event.Records),
  }
  // Todo do some processing/aggregating here with the event data and Athena
  return response
}