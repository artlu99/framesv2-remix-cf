import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";
import { RiGithubLine } from "@remixicon/react";
import { ClientOnly } from "remix-utils/client-only";
import EnvLookthrough from "~/components/EnvLookthrough.client";
import config from "~/config.json";
import { db } from "~/lib/postgres";
import { incrCount } from "~/lib/redis";

export const meta: MetaFunction = () => {
  const appUrl = config.appUrl;
  const { title, description } = config.meta;

  return [
    { title },
    { description },
    { "og:title": title },
    { "og:type": "website" },
    { "og:image": `${appUrl}/icon.png` },
    { "og:url": appUrl },
  ];
};

export const loader = async ({ context }: LoaderFunctionArgs) => {
  const { env } = context.cloudflare;
  const count = await (async () => {
    try {
      return await incrCount(env);
    } catch {
      console.error("Redis error");
      return -1;
    }
  })();

  const dbResponse = await (async () => {
    try {
      return await db(env)
        .selectFrom("about")
        .selectAll()
        .orderBy("about.version desc")
        .executeTakeFirst();
    } catch (error) {
      console.error("Database query failed:", error);
      return null;
    }
  })();
  const dbVersion = dbResponse?.version ?? "unknown";

  return Response.json({
    myVar: env.MY_VAR,
    count,
    dbVersion,
  }) as unknown as {
    myVar: string;
    count: number;
    dbVersion: string;
  };
};

export default function Nerds() {
  const { myVar, count, dbVersion } = useLoaderData<typeof loader>();

  const logoSize = 30;
  return (
    <div className="p-4 dark:text-gray-300">
      <article className="prose">
        <h3>Farcaster Frames V2 starter</h3>
        <div>
          <div className="flex items-center text-sm">
            <RiGithubLine />{" "}
            <a href={config.githubUrl}>hono-remix-vite-on-cloudflare</a>
          </div>
        </div>

        <p className="italic">
          <ul>
            <li>Remix v2/React18</li>
            <li>Hono Stack: end-to-end type-safe APIs</li>
            <li>Vite HMR devtools</li>
            <li>deploy to Cloudflare Pages</li>
            <li>Redis + Postgres batteries included</li>
            <li>seamless Farcaster login with Privy</li>
          </ul>
        </p>
      </article>
      <div className="flex flex-cols my-8">
        <img src="/favicon.ico" height={logoSize} width={logoSize} />
        <img src="/assets/hono-logo.png" height={logoSize} width={logoSize} />
        <img src="/assets/vite.svg" height={logoSize} width={logoSize} />
        <img src="/assets/farcaster.svg" height={logoSize} width={logoSize} />
        <img src="/assets/cloudflare.svg" height={logoSize} width={logoSize} />
      </div>
      <article className="prose">
        <div>
          <h4 className="underline">Dev demos:</h4>
          <ul>
            <li>
              Hono <a href="/hono?queryToken=wide-open">open endpoint</a>
            </li>
            <li>
              myVar: <code>{myVar}</code> [server-side using Remix loader]{" "}
            </li>
            <li>
              <ClientOnly fallback={<div>Loading...</div>}>
                {() => <EnvLookthrough />}
              </ClientOnly>{" "}
              [client-side using React + TanStack Query]
            </li>
            <li>
              counter: <code>{count}</code> [Redis]
            </li>
            <li>
              dbVersion: <code>{dbVersion}</code> [Postgres]
            </li>
          </ul>
        </div>
      </article>
    </div>
  );
}
