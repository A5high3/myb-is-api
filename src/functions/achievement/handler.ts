import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';

import { DynamoDBHandler } from "@libs/dynamodb"

const archive = async (event) => {
  console.log("event", event)

  const request = DynamoDBHandler.generateScanRequestOfNewsTable();
  const result  = await DynamoDBHandler.scan(request)
  
  console.log("scanResult: ", result)

  result.forEach( v => {
    delete v.news_id
    delete v.sort_index
  })

  return formatJSONResponse({
    content: result,
  }, event.headers.origin);
};

export const main = middyfy(archive);
