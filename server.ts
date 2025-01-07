import { zValidator } from "@hono/zod-validator";
import type { AppLoadContext, RequestHandler } from "@remix-run/cloudflare";
import { Hono } from "hono";
import { poweredBy } from "hono/powered-by";
import { staticAssets } from "remix-hono/cloudflare";
import { remix } from "remix-hono/handler";
import { z } from "zod";
import { incrCount } from "~/lib/redis";
import type { Env } from "~/type/env";

const app = new Hono<{ Bindings: Env }>();

let handler: RequestHandler | undefined;

// @ts-ignore - cloudflare binding type
app.use(poweredBy());

const routes = app
	.get(
		"/hono",
		zValidator("query", z.object({ queryToken: z.string() })),
		async (c) => {
			return c.json({ My_var: c.env.MY_VAR });
		},
	)
	.post("/count", zValidator("query", z.object({})), async (c) => {
		try {
			const count = await incrCount(c.env);
			return c.json({ count });
		} catch {
			console.error("Redis error");
			return c.json({ count: -1 });
		}
	});

app.use(
	async (c, next) => {
		if (process.env.NODE_ENV !== "development" || import.meta.env.PROD) {
			// @ts-ignore - cloudflare binding type
			return staticAssets()(c, next);
		}
		await next();
	},
	async (c, next) => {
		if (process.env.NODE_ENV !== "development" || import.meta.env.PROD) {
			const serverBuild = await import("./build/server");
			return remix({
				// @ts-ignore
				build: serverBuild,
				mode: "production",
				// @ts-ignore
				getLoadContext(c) {
					return {
						cloudflare: {
							env: c.env,
						},
					};
				},
				// @ts-ignore - cloudflare binding type
			})(c, next);
		} else {
			if (!handler) {
				// @ts-expect-error it's not typed
				const build = await import("virtual:remix/server-build");
				const { createRequestHandler } = await import("@remix-run/cloudflare");
				handler = createRequestHandler(build, "development");
			}
			const remixContext = {
				cloudflare: {
					env: c.env,
				},
			} as unknown as AppLoadContext;
			return handler(c.req.raw, remixContext);
		}
	},
);

export type AppType = typeof routes;

export default app;
