/* tslint:disable */
/* eslint-disable */
import "sst"
declare module "sst" {
  export interface Resource {
    MyWeb: {
      type: "sst.aws.Nextjs"
      url: string
    }
    OpenaiApiKey: {
      type: "sst.sst.Secret"
      value: string
    }
  }
}
export {}