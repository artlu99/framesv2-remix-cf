import { neonConfig } from "@neondatabase/serverless";
import dotenv from 'dotenv';
import { FileMigrationProvider, Kysely, Migrator } from "kysely";
import { NeonDialect } from "kysely-neon";
import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import ws from "ws";
import type { Database } from "~/type/kysely";

const connectionString = dotenv.config().parsed?.NEON_DATABASE_URL;

async function migrateToLatest() {
	const __filename = fileURLToPath(import.meta.url);
	const __dirname = path.dirname(__filename);

	neonConfig.webSocketConstructor = ws;
	const db = new Kysely<Database>({
		dialect: new NeonDialect({ connectionString }),
	});

	const migrator = new Migrator({
		db,
		provider: new FileMigrationProvider({
			fs,
			path,
			// This needs to be an absolute path.
			migrationFolder: path.join(__dirname, "/migrations"),
		}),
	});

	const { error, results } = await migrator.migrateToLatest();

	for (const it of results ?? []) {
		if (it.status === "Success") {
			console.log(`migration "${it.migrationName}" was executed successfully`);
		} else if (it.status === "Error") {
			console.error(`failed to execute migration "${it.migrationName}"`);
		}
	}

	if (error) {
		console.error("failed to migrate");
		console.error(error);
		process.exit(1);
	}

	await db.destroy();
}

migrateToLatest();
