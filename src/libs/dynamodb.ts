import {
  DynamoDBClient,
  GetItemCommand,
  ScanCommandInput,
  ScanCommand,
  PutItemCommand,
  PutItemCommandInput,
  UpdateItemCommandInput,
  UpdateItemCommand,
  DeleteItemCommandInput,
  DeleteItemCommand,
  GetItemCommandInput,
} from "@aws-sdk/client-dynamodb";

import { unmarshall } from "@aws-sdk/util-dynamodb";

export enum DynamoDbTable {
  NEWS_TABLE = "myb-is-news",
  MIX_TABLE = "myb-is-mix",
  OHAMYABI_TABLE = "ohamyabi"
}

export class DynamoDBHandler {
  constructor() {}

  public static  db = new DynamoDBClient({ region: "ap-northeast-1" });

  public static async get(request: GetItemCommandInput) {
    console.log("getRequest", request)
    const result = await DynamoDBHandler.db.send(new GetItemCommand(request))
    console.log("getResult", result)
    const unmarshalled = unmarshall(result.Item)
    return unmarshalled
  }

  public static async scan(request: ScanCommandInput) {
    const result = await DynamoDBHandler.db.send(new ScanCommand(request));
    console.log("scanResult", result);
    const news = result.Items.map((v) => unmarshall(v));
    console.log("newsdata", news);

    const sorted = news.sort((v, i) => i.sort_index - v.sort_index);

    return sorted;
  }

  public static async put(request: PutItemCommandInput) {
    await DynamoDBHandler.db.send(new PutItemCommand(request));

    return;
  }

  public static async update(
    request: UpdateItemCommandInput
  ): Promise<undefined> {
    console.log(request);
    await DynamoDBHandler.db.send(new UpdateItemCommand(request));
    return;
  }

  public static async delete (request: DeleteItemCommandInput): Promise<undefined> {
    console.log(request);
    await DynamoDBHandler.db.send(new DeleteItemCommand(request));
    return
  }
}
