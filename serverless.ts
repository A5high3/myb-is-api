import type { AWS } from "@serverless/typescript";

import hello from "@functions/hello";
import interactions from "@functions/interactions";

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
      DISCORD_PUBLIC_KEY: "5d576ee0534a01e310b6882d98339384296e19b0ce0010989200e4c3bd7cd265",
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
  functions: { hello, interactions },
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
