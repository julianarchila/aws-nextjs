/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  console: {
    autodeploy: {
      target(event) {
        if (event.type === "branch" && event.branch === "main") {
          return {
            stage: "production",
          };
        }
      },
    },
  },
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
    const secrets = {
      OpenaiApiKey: new sst.Secret("OpenaiApiKey"),
      RedisUrl: new sst.Secret("RedisUrl"),
      RedisKey: new sst.Secret("RedisKey"),
    };
    const allSecrets = Object.values(secrets);

    new sst.aws.Nextjs(
      "MyWeb",
      {
        link: [...allSecrets],
        transform: {
          server: (args) => {
            args.timeout = "30 second";
          },
        },
      },
      {},
    );
  },
});
