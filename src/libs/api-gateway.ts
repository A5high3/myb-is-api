import type { APIGatewayProxyEvent, APIGatewayProxyResult, Handler } from "aws-lambda"
import type { FromSchema } from "json-schema-to-ts";

type ValidatedAPIGatewayProxyEvent<S> = Omit<APIGatewayProxyEvent, 'body'> & { body: FromSchema<S> }
export type ValidatedEventAPIGatewayProxyEvent<S> = Handler<ValidatedAPIGatewayProxyEvent<S>, APIGatewayProxyResult>

export const format401Response = (response: Record<string, unknown>) => {
  return {
    statusCode: 401,
    body: JSON.stringify(response)
  }
}

export const formatJSONResponse = (response: Record<string, unknown>, origin) => {
  const res = {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": origin,
    },
    body: JSON.stringify(response)
  }
  console.log("res", res)
  return res
}


export const formatDiscordResponse = (response: Record<string, unknown>) => {
  const res = {
    statusCode: 200,
    body: JSON.stringify(response)
  }
  console.log("res", res)
  return res
}
