import {
  ScanCommandInput,
  PutItemCommandInput,
  UpdateItemCommandInput,
  DeleteItemCommandInput,
} from "@aws-sdk/client-dynamodb";

import { v4 as uuidv4 } from "uuid";

import { DynamoDbTable } from "../../../libs/dynamodb";

export default class Mix {
  public static generateScanRequest(): ScanCommandInput {
    return {
      TableName: DynamoDbTable.MIX_TABLE,
    };
  }

  public static generatePutRequest(
    requestBody,
    scanResult
  ): PutItemCommandInput {
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
      TableName: DynamoDbTable.MIX_TABLE,
      Item: {
        mix_id: { S: uuid.slice(0, 7) },
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
    const mixIdSection = requestBody.data.options[0].options.find(
      (v) => v.name === "mixid"
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

    const yyyy = dateSection.value.slice(0, 4);

    let mm = dateSection.value.slice(4, 6);
    if (mm[0] === "0") {
      mm = dateSection.value.slice(4, 6).replace("0", " ");
    }

    let dd = dateSection.value.slice(6, 8);
    if (dd[0] === "0") {
      dd = dateSection.value.slice(6, 8).replace("0", " ");
    }


    const req: UpdateItemCommandInput = {
      TableName: DynamoDbTable.MIX_TABLE,
      Key: {
        mix_id: { S: mixIdSection.value },
      },
      UpdateExpression:
        "SET #publishdate = :publishdate, link = :link, content = :content",
      ExpressionAttributeValues: {
        ":publishdate": { S: `${yyyy}/${mm}/${dd}` },
        ":link": { S: linkSection.value },
        ":content": { S: contentSection.value },
      },
      ExpressionAttributeNames: {
        "#publishdate": "date",
      },
    };

    return req;
  }

  public static generateDeleteRequest(requestBody): DeleteItemCommandInput {
    const mixIdSection = requestBody.data.options[0].options.find(
      (v) => v.name === "mixid"
    );

    const req: DeleteItemCommandInput = {
      TableName: DynamoDbTable.MIX_TABLE,
      Key: {
        mix_id: { S: mixIdSection.value },
      },
    };

    return req;
  }
}
