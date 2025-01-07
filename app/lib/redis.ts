import { Redis } from "@upstash/redis/cloudflare";
import type { Env } from "~/type/env";

const redisClient = (env: Env) => Redis.fromEnv(env);

export const incrCount = async (env: Env) => {
	const redis = redisClient(env);
	const key = `count`;
	const value = await redis.incr(key);
	return value;
};
