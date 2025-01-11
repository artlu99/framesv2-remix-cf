import { type Kysely, sql } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
	await db.schema
		.createTable("links")
		.addColumn("id", "serial", (col) => col.primaryKey())
		.addColumn("order", "integer", (col) => col.notNull())
		.addColumn("fid", "integer", (col) => col.notNull())
		.addColumn("label", "text", (col) => col.notNull())
		.addColumn("url", "text", (col) => col.notNull())
		.addColumn("created_at", "timestamp", (col) =>
			col.defaultTo(sql`now()`).notNull(),
		)
		.execute();

	await db.schema
		.createTable("wallets")
		.addColumn("id", "serial", (col) => col.primaryKey())
		.addColumn("order", "integer", (col) => col.notNull())
		.addColumn("fid", "integer", (col) => col.notNull())
		.addColumn("label", "text", (col) => col.notNull())
		.addColumn("address", "text", (col) => col.notNull())
		.addColumn("tooltip", "text", (col) => col.notNull())
		.addColumn("created_at", "timestamp", (col) =>
			col.defaultTo(sql`now()`).notNull(),
		)
		.execute();

	await db
		.insertInto("links")
		.values({
			order: 0,
			fid: 6546,
			label: "Home page",
			url: "https://artlu.xyz",
		})
		.execute();

	await db
		.insertInto("links")
		.values({
			order: 1,
			fid: 6546,
			label: "Github",
			url: "https://github.com/artlu99",
		})
		.execute();

	await db
		.insertInto("links")
		.values({
			order: 2,
			fid: 6546,
			label: "Twitter",
			url: "https://x.com/artlu99",
		})
		.execute();

	await db
		.insertInto("links")
		.values({
			order: 3,
			fid: 6546,
			label: "Telegram",
			url: "https://t.me/artlu99",
		})
		.execute();

	await db
		.insertInto("links")
		.values({
			order: 4,
			fid: 6546,
			label: "Bluesky",
			url: "https://bsky.app/profile/artlu.xyz",
		})
		.execute();

	await db
		.insertInto("wallets")
		.values({
			order: 0,
			fid: 6546,
			label: "Clanker",
			address: "0x097745F2FB83C104543F93E528B455FC3cE392b6",
			tooltip: "🌯 BURROTI",
		})
		.execute();

	await db
		.insertInto("wallets")
		.values({
			order: 1,
			fid: 6546,
			label: "ENS (1st)",
			address: "0x094f1608960A3cb06346cFd55B10b3cEc4f72c78",
			tooltip: "🎩 fafo.artlu.eth",
		})
		.execute();

	await db
		.insertInto("wallets")
		.values({
			order: 2,
			fid: 6546,
			label: "(verified)",
			address: "HgKZky6hf1fiRPuM6tAc2yn9pKvnEeiMmfRGJGWQBTJh",
			tooltip: "🟣 Solana",
		})
		.execute();
}

export async function down(db: Kysely<any>): Promise<void> {
	await db.schema.dropTable("links").execute();
}
