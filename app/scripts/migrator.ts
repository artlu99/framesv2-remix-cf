import { neonConfig } from '@neondatabase/serverless'
import { promises as fs } from 'fs'
import {
    FileMigrationProvider,
    Kysely,
    Migrator,
} from 'kysely'
import { NeonDialect } from 'kysely-neon'
import path from 'path'
import { fileURLToPath } from 'url'
import ws from 'ws'
import { Database } from '~/type/kysely'

const DATABASE_URL='postgresql://neondb_owner:y5g7FkCYnMRt@ep-little-mud-a5iibufh.us-east-2.aws.neon.tech/neondb?sslmode=require';

async function migrateToLatest() {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  neonConfig.webSocketConstructor = ws;
  const db = new Kysely<Database>({dialect: new NeonDialect({connectionString: DATABASE_URL
  })})

  const migrator = new Migrator({
    db,
    provider: new FileMigrationProvider({
      fs,
      path,
      // This needs to be an absolute path.
      migrationFolder: path.join(__dirname, '/migrations')
    }),
  })

  const { error, results } = await migrator.migrateToLatest()

  results?.forEach((it) => {
    if (it.status === 'Success') {
      console.log(`migration "${it.migrationName}" was executed successfully`)
    } else if (it.status === 'Error') {
      console.error(`failed to execute migration "${it.migrationName}"`)
    }
  })

  if (error) {
    console.error('failed to migrate')
    console.error(error)
    process.exit(1)
  }

  await db.destroy()
}

migrateToLatest()