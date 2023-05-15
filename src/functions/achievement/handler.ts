import { formatJSONResponse } from "@libs/api-gateway";
import { middyfy } from "@libs/lambda";

import { DynamoDBHandler } from "@libs/dynamodb";
import Domain from "../interactions/domain"

const archive = async (event) => {
  console.log("event", event);

  let origin = event.headers.origin;

  if (!origin) {
    origin = event.headers["Origin"];
  }

  const newsRequest = Domain.News.generateScanRequest();
  const mixRequest = Domain.Mix.generateScanRequest();

  
  const newsResult = await DynamoDBHandler.scan(newsRequest);
  const mixResult = await DynamoDBHandler.scan(mixRequest);

  console.log("scanResult: ", newsResult);

  newsResult.forEach((v) => {
    delete v.news_id;
    delete v.sort_index;
  });
  mixResult.forEach((v) => {
    delete v.mix_id;
    delete v.sort_index;
  })

  return formatJSONResponse(
    {
      content: {news: newsResult, mix: mixResult},
    },
    origin
  );
};

export const main = middyfy(archive);
