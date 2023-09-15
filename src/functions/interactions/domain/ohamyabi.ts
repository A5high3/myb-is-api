import { ScanCommandInput } from "@aws-sdk/client-dynamodb";
import { DynamoDbTable } from "../../../libs/dynamodb";

export default class Ohamyabi {
  public static generateScanRequest(): ScanCommandInput {
    return {
      TableName: DynamoDbTable.OHAMYABI_TABLE,
    };
  }
}
