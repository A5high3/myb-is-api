import { formatDiscordResponse, format401Response } from "@libs/api-gateway";
import { middyfy } from "@libs/lambda";

import { InteractionType, InteractionResponseType } from "discord-interactions";
import { DynamoDBHandler } from "@libs/dynamodb";
import Domain from "./domain";
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
    return formatDiscordResponse({
      type: InteractionResponseType.PONG,
      data: {
        content: `You used: ${requestBody.data}`,
      },
    });
  }

  if (requestBody && requestBody.type === InteractionType.APPLICATION_COMMAND) {
    // /news list (Discord interaction)
    if (DiscordHandler.isNewsList(requestBody)) {
      const request = Domain.News.generateScanRequest();
      const scanResult = await DynamoDBHandler.scan(request);

      let str = "";
      scanResult.forEach((v) => {
        str += `id: ${v.news_id}\n日付: ${v.date}\nメッセージ: ${v.content}\nリンク: ${v.link}\n\n`;
      });

      return formatDiscordResponse({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          content: str,
        },
      });
    }

    // /news regist (Discord interaction)
    if (DiscordHandler.isNewsRegist(requestBody)) {
      const scanRequest = Domain.News.generateScanRequest();
      const scanResult = await DynamoDBHandler.scan(scanRequest);

      const request = Domain.News.generatePutRequest(requestBody, scanResult);
      await DynamoDBHandler.put(request);

      return formatDiscordResponse({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          content: `ニュースの登録が完了しました`,
        },
      });
    }

    if (DiscordHandler.isNewsUpdate(requestBody)) {
      const updateRequst = Domain.News.generateUpdateRequest(requestBody);
      await DynamoDBHandler.update(updateRequst);

      return formatDiscordResponse({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          content: "ニュースの更新が完了しました",
        },
      });
    }

    if (DiscordHandler.isNewsDelete(requestBody)) {
      const deleeteRequest = Domain.News.generateDeleteRequest(requestBody);
      await DynamoDBHandler.delete(deleeteRequest);
      return formatDiscordResponse({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          content: "ニュースの削除が完了しました",
        },
      });
    }

    if (DiscordHandler.isMixList(requestBody)) {
      const request = Domain.Mix.generateScanRequest();
      const scanResult = await DynamoDBHandler.scan(request);

      let str = "";
      scanResult.forEach((v) => {
        str += `id: ${v.mix_id}\n日付: ${v.date}\nメッセージ: ${v.content}\nリンク: ${v.link}\n\n`;
      });

      return formatDiscordResponse({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          content: str,
        },
      });
    }

    if (DiscordHandler.isMixRegist(requestBody)) {
      const scanRequest = Domain.Mix.generateScanRequest();
      const scanResult = await DynamoDBHandler.scan(scanRequest);

      const request = Domain.Mix.generatePutRequest(requestBody, scanResult);
      await DynamoDBHandler.put(request);

      return formatDiscordResponse({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          content: `MIX実績の登録が完了しました`,
        },
      });
    }

    if (DiscordHandler.isMixUpdate(requestBody)) {
      const updateRequst = Domain.Mix.generateUpdateRequest(requestBody);
      await DynamoDBHandler.update(updateRequst);

      return formatDiscordResponse({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          content: "MIX実績の更新が完了しました",
        },
      });
    }

    if (DiscordHandler.isMixDelete(requestBody)) {
      const deleeteRequest = Domain.Mix.generateDeleteRequest(requestBody);
      await DynamoDBHandler.delete(deleeteRequest);
      return formatDiscordResponse({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          content: "MIX実績の削除が完了しました",
        },
      });
    }
  }

  return formatDiscordResponse({
    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
    data: {
      content: `hello world.\n foobar.`,
    },
  });
};

export const main = middyfy(interactions);
