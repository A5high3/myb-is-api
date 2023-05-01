import { formatJSONResponse, format401Response } from "@libs/api-gateway";
import { middyfy } from "@libs/lambda";

import { InteractionType, InteractionResponseType } from "discord-interactions";
import { DynamoDBHandler } from "@libs/dynamodb";
import { DiscordHandler } from "@libs/discord";

const interactions = async (event) => {
  console.log("event:", event);
  console.log("body:", event.body);
  console.log("body:", event.body?.data?.options);
  console.log("headers:", event.headers);

  const result = DiscordHandler.verifyRequest(event);
  if (!result) {
    return format401Response({
      type: InteractionResponseType.PONG,
    });
  }

  const requestBody = event.body;
  // Discord interaction検証用
  if (requestBody && requestBody.type === InteractionType.PING) {
    return formatJSONResponse({
      type: InteractionResponseType.PONG,
      data: {
        content: `You used: ${requestBody.data}`,
      },
    });
  }

  if (requestBody && requestBody.type === InteractionType.APPLICATION_COMMAND) {
    // /news list (Discord interaction)
    if (DiscordHandler.isNewsList(requestBody)) {
      const request = DynamoDBHandler.generateScanRequestOfNewsTable();
      const scanResult = await DynamoDBHandler.scan(request);

      let str = "";
      scanResult.forEach((v) => {
        str += `id: ${v.news_id}\n日付: ${v.date}\nメッセージ: ${v.content}\nリンク: ${v.link}\n\n`;
      });

      return formatJSONResponse({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          content: str,
        },
      });
    }

    // /news regist (Discord interaction)
    if (DiscordHandler.isNewsRegist(requestBody)) {
      const scanRequest = DynamoDBHandler.generateScanRequestOfNewsTable();
      const scanResult = await DynamoDBHandler.scan(scanRequest);

      const request = DynamoDBHandler.generatePutRequest(
        requestBody,
        scanResult
      );
      await DynamoDBHandler.put(request);

      return formatJSONResponse({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          content: `ニュースの登録が完了しました`,
        },
      });
    }
  }

  return formatJSONResponse({
    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
    data: {
      content: `hello world.\n foobar.`,
    },
  });
};

export const main = middyfy(interactions);
