import { Redis } from "@upstash/redis";

import { Resource } from "sst";

export const redis = new Redis({
  url: Resource.RedisUrl.value,
  token: Resource.RedisKey.value,
});
