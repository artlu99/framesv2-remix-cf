import { Kysely } from 'kysely';
import { NeonDialect } from 'kysely-neon';
import { Env } from '~/type/env';
import { Database } from '~/type/kysely';

export const db = (env: Env) => new Kysely<Database>({
    dialect: new NeonDialect({
      connectionString: env.DATABASE_URL
    }),
  });
  