import { GetItemCommandInput, PutItemCommandInput, ScanCommandInput } from "@aws-sdk/client-dynamodb";
import { DynamoDbTable } from "../../../libs/dynamodb";

export default class Ohamyabi {
  public static generateGetItemRequest(id: string): GetItemCommandInput {
    return {
      TableName: DynamoDbTable.OHAMYABI_TABLE,
      Key: {
        id: {"S": id}
      }
    };
  }

  public static generateScanRequest(): ScanCommandInput {
    return {
      TableName: DynamoDbTable.OHAMYABI_TABLE,
    };
  }

  public static generatePutRequest(requestBody, scanResult): PutItemCommandInput {
    const phraze = requestBody.data?.options[0].options.find(
      (v) => v.name === "phraze"
    );

    console.log("scanResult", scanResult)

    const sorted = scanResult.sort((a, b) => b.id - a.id)
    const request = {
      TableName: DynamoDbTable.OHAMYABI_TABLE,
      Item: {
        id: { S:  `${+sorted[0].id + 1}`},
        content: {S: phraze.value}
      },
    };
    console.log("putRequest", request);
    return request;
  }
}
