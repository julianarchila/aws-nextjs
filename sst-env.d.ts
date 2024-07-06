/* tslint:disable */
/* eslint-disable */
import "sst"
declare module "sst" {
  export interface Resource {
    MyWeb: {
      type: "sst.aws.Nextjs"
    }
    OpenaiApiKey: {
      type: "sst.sst.Secret"
      value: string
    }
    RedisKey: {
      type: "sst.sst.Secret"
      value: string
    }
    RedisUrl: {
      type: "sst.sst.Secret"
      value: string
    }
  }
}
export {}