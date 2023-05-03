import {
  DynamoDBClient,
  ScanCommandInput,
  ScanCommand,
  PutItemCommand,
  PutItemCommandInput,
} from "@aws-sdk/client-dynamodb";

import { unmarshall } from "@aws-sdk/util-dynamodb";
import { v4 as uuidv4 } from "uuid";

export enum DynamoDbTable {
  NEWS_TABLE = "myb-is-news",
}

export class DynamoDBHandler {
  constructor() {}

  public static generateScanRequestOfNewsTable(): ScanCommandInput {
    return {
      TableName: DynamoDbTable.NEWS_TABLE,
    };
  }

  public static async scan(request: ScanCommandInput) {
    const dynamodb = new DynamoDBClient({ region: "ap-northeast-1" });
    const result = await dynamodb.send(new ScanCommand(request));
    console.log("scanResult", result);
    const news = result.Items.map((v) => unmarshall(v));
    console.log("newsdata", news);

    const sorted = news.sort((v, i) => i.sort_index - v.sort_index);

    return sorted;
  }

  /**
   *
   * @param requestBody
   * @param scanResult
   * @returns
   */
  public static generatePutRequest(requestBody, scanResult) {
    const uuid = uuidv4();

    const dateSection = requestBody.data?.options[0].options.find(
      (v) => v.name === "date"
    );
    const linkSection = requestBody.data?.options[0].options.find(
      (v) => v.name === "link"
    );
    const contentSection = requestBody.data?.options[0].options.find(
      (v) => v.name === "content"
    );

    const yyyy = dateSection.value.slice(0, 4);

    let mm = dateSection.value.slice(4, 6);
    if (mm[0] === "0") {
      mm = dateSection.value.slice(4, 6).replace("0", " ");
    }

    let dd = dateSection.value.slice(6, 8);
    if (dd[0] === "0") {
      dd = dateSection.value.slice(6, 8).replace("0", " ");
    }

    const request = {
      TableName: DynamoDbTable.NEWS_TABLE,
      Item: {
        news_id: { S: uuid.slice(0, 7) },
        date: { S: `${yyyy}/${mm}/${dd}` },
        link: { S: linkSection.value },
        content: { S: contentSection.value },
        sort_index: { N: `${scanResult[0].sort_index + 1}` },
      },
    };
    console.log("putRequest", request);
    return request;
  }

  public static async put(request: PutItemCommandInput) {
    const dynamodb = new DynamoDBClient({ region: "ap-northeast-1" });
    await dynamodb.send(new PutItemCommand(request));

    return;
  }
}
