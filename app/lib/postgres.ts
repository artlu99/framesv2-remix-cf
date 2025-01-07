import { Kysely } from "kysely";
import { NeonHTTPDialect } from "kysely-neon";
import type { Env } from "~/type/env";
import type { Database } from "~/type/kysely";

export const db = (env: Env) =>
	new Kysely<Database>({
		/* 
  NeonHTTPDialect is an experimental neon function that allows making 
  stateless HTTPS requests, that should have lower latencies, but
  no session or transaction support. 
  
  To use a more stable, more fully-featured but slightly slower dialect,
  import and use NeonDialect instead of NeonHTTPDialect.
  N.B.: NeonDialect depends on websockets. Hence, it does not work exactly 
  the same way in local development as when deployed to Cloudflare.
  */
		dialect: new NeonHTTPDialect({
			connectionString: env.DATABASE_URL,
		}),
	});
