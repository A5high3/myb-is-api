import type { AWS } from "@serverless/typescript";

import hello from "@functions/hello";
import interactions from "@functions/interactions";
import archive from "@functions/achievement"

const serverlessConfiguration: AWS = {
  service: "myb-is-api",
  frameworkVersion: "3",
  plugins: ["serverless-esbuild"],
  provider: {
    name: "aws",
    runtime: "nodejs18.x",
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: "1",
      NODE_OPTIONS: "--enable-source-maps --stack-trace-limit=1000",
      MYB_IS_GOD_APP_ID: "1092820873817362432",
      DISCORD_PUBLIC_KEY: "5d576ee0534a01e310b6882d98339384296e19b0ce0010989200e4c3bd7cd265",
      OHAMYABI_APP_ID: "1152233520169754625",
      OHAMYABI_PUB_KEY: "50e3b2a377271e8f8c2b3efb5d2e759947b760aa7cc1cea763a066e8cc6302ec",
    },
    iamRoleStatements: [
      {
        Effect: "Allow",
        Action: ["dynamodb:*"],
        Resource: "arn:aws:dynamodb:ap-northeast-1:*:*",
      },
    ],
    region: "ap-northeast-1",
  },
  // import the function via paths
  functions: { hello, interactions, archive },
  resources: {
    Resources: {
      newsTable: {
        Type: "AWS::DynamoDB::Table",
        Properties: {
          TableName: "myb-is-news",
          AttributeDefinitions: [
            {
              AttributeName: "news_id",
              AttributeType: "S",
            },
          ],
          KeySchema: [
            {
              KeyType: "HASH",
              AttributeName: "news_id",
            },
          ],
          ProvisionedThroughput: {
            ReadCapacityUnits: 2,
            WriteCapacityUnits: 2,
          },
        },
      },
      mixTable: {
        Type: "AWS::DynamoDB::Table",
        Properties: {
          TableName: "myb-is-mix",
          AttributeDefinitions: [
            {
              AttributeName: "mix_id",
              AttributeType: "S",
            },
          ],
          KeySchema: [
            {
              KeyType: "HASH",
              AttributeName: "mix_id",
            },
          ],
          ProvisionedThroughput: {
            ReadCapacityUnits: 2,
            WriteCapacityUnits: 2,
          },
        },
      },
      ohamyabiTable: {
        Type: "AWS::DynamoDB::Table",
        Properties: {
          TableName: "ohamyabi",
          AttributeDefinitions: [
            {
              AttributeName: "id",
              AttributeType: "S",
            },
          ],
          KeySchema: [
            {
              KeyType: "HASH",
              AttributeName: "id",
            },
          ],
          ProvisionedThroughput: {
            ReadCapacityUnits: 1,
            WriteCapacityUnits: 1,
          },
        },
      },
    },
  },
  package: { individually: true },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ["aws-sdk"],
      target: "node14",
      define: { "require.resolve": undefined },
      platform: "node",
      concurrency: 10,
    },
  },
};

module.exports = serverlessConfiguration;
