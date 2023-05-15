import {
    ScanCommandInput,
    PutItemCommandInput,
    UpdateItemCommandInput,
    DeleteItemCommandInput,
  } from "@aws-sdk/client-dynamodb";
  

import { v4 as uuidv4 } from "uuid";

import { DynamoDbTable } from "../../../libs/dynamodb"

export default class News {
  public static generateScanRequest(): ScanCommandInput {
    return {
      TableName: DynamoDbTable.NEWS_TABLE,
    };
  }

  public static generatePutRequest(requestBody, scanResult): PutItemCommandInput {
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

  public static generateUpdateRequest(requestBody): UpdateItemCommandInput {
    const newsIdSection = requestBody.data.options[0].options.find(
      (v) => v.name === "newsid"
    );
    const dateSection = requestBody.data?.options[0].options.find(
      (v) => v.name === "date"
    );
    const linkSection = requestBody.data?.options[0].options.find(
      (v) => v.name === "link"
    );
    const contentSection = requestBody.data?.options[0].options.find(
      (v) => v.name === "content"
    );

    const req: UpdateItemCommandInput = {
      TableName: DynamoDbTable.NEWS_TABLE,
      Key: {
        news_id: {"S": newsIdSection.value},
      },
      UpdateExpression: "SET #publishdate = :publishdate, link = :link, content = :content",
      ExpressionAttributeValues: {
        ":publishdate": {S: dateSection.value},
        ":link": {S: linkSection.value},
        ":content": {S: contentSection.value}
      },
      ExpressionAttributeNames: {
        "#publishdate": "date"
      }
    };

    return req;
  }

  public static generateDeleteRequest(requestBody): DeleteItemCommandInput {
    const newsIdSection = requestBody.data.options[0].options.find(
      (v) => v.name === "newsid"
    );

    const req: DeleteItemCommandInput = {
      TableName: DynamoDbTable.NEWS_TABLE,
      Key: {
        news_id: {"S": newsIdSection.value},
      },
    };

    return req;
  }
}
