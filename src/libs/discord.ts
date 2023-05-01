import { verifyKey } from "discord-interactions";

export class DiscordHandler {
  public static verifyRequest(event) {
    const { headers } = event;
    const signature = headers["x-signature-ed25519"];
    const timestamp = headers["x-signature-timestamp"];
    const publicKey = process.env["DISCORD_PUBLIC_KEY"];

    const result = verifyKey(event.rawBody, signature, timestamp, publicKey);
    console.log("verifyResult", result);
    return result;
  }

  public static isNewsList(requestBody): boolean {
    return (
      requestBody.data.name === "news" &&
      requestBody.data.options.some((v) => v.name === "list")
    );
  }

  public static isNewsRegist(requestBody): boolean {
    return (
      requestBody.data.name === "news" &&
      requestBody.data.options.some((v) => v.name === "regist")
    );
  }
}
