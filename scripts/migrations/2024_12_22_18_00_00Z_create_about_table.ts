import { type Kysely, sql } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
	await db.schema
		.createTable("about")
		.addColumn("id", "serial", (col) => col.primaryKey())
		.addColumn("version", "varchar", (col) => col.notNull())
		.addColumn("created_at", "timestamp", (col) =>
			col.defaultTo(sql`now()`).notNull(),
		)
		.execute();

	await db
		.insertInto("about")
		.values({
			version: "0.1",
		})
		.execute();
}

export async function down(db: Kysely<any>): Promise<void> {
	await db.schema.dropTable("about").execute();
}
