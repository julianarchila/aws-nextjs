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

    new sst.aws.Nextjs("MyWeb", {
      environment: {
        OPENAI_API_KEY: OpenaiApiKey.value,
      },
    });
  },
});
