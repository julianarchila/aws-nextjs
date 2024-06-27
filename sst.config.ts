/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: "aws-nextjs",
      removal: input?.stage === "production" ? "retain" : "remove",
      home: "aws",
      providers: {
        aws: {
          region: "us-east-1",
          profile: "default",
        },
      },
    };
  },
  async run() {
    const OpenaiApiKey = new sst.Secret("OpenaiApiKey");

    const RedisUrl = new sst.Secret(
      "RedisUrl",
      "https://us1-cuddly-sloth-41165.upstash.io",
    );

    const RedisKey = new sst.Secret("RedisKey");

    new sst.aws.Nextjs("MyWeb", {
      environment: {
        OPENAI_API_KEY: OpenaiApiKey.value,
        REDIS_URL: RedisUrl.value,
        REDIS_KEY: RedisKey.value,
      },
    });
  },
});
