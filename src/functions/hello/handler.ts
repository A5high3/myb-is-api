import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';

import schema from './schema';

import {DynamoDBClient, ScanCommandInput, ScanCommand} from "@aws-sdk/client-dynamodb"

const hello: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {

  const dynamo = new DynamoDBClient({region: "ap-northeast-1"})

  const scanRequest: ScanCommandInput  = {
    TableName: "myb-is-news"
  }
  const result = await dynamo.send(new ScanCommand(scanRequest))

  console.log("scanResult: ", result)

  return formatJSONResponse({
    message: `Hello ${event.body.name}, welcome to the exciting Serverless world!`,
  });
};

export const main = middyfy(hello);
