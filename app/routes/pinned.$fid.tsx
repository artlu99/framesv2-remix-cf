import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";
import { ClientOnly } from "remix-utils/client-only";
import invariant from "tiny-invariant";
import { DevDemos } from "~/components/DevDemos.client";
import { LinktreePlus } from "~/components/LinktreePlus.client";
import { TopNavBar } from "~/components/TopNavBar.client";
import { WalletsList } from "~/components/WalletsList.client";
import config from "~/config.json";
import { ogImageUrl } from "~/lib/og";
import { db } from "~/lib/postgres";
import { incrCount } from "~/lib/redis";
import type { Link, Wallet } from "~/type/linktreeTypes";

interface LoaderData {
  myVar: string;
  fid: number;
  count: number;
  imageUrl: string;
  links: Link[];
  wallets: Wallet[];
}

export const meta: MetaFunction = ({ data }) => {
  const { fid, imageUrl } = data as LoaderData;

  // https://docs.farcaster.xyz/developers/frames/v2/spec
  const appUrl = config.appUrl;
  const name = config.meta.name;
  const frame = {
    version: "next",
    imageUrl,
    button: {
      title: config.button.title,
      action: {
        type: "launch_frame",
        name,
        url: `${appUrl}/pinned/${fid}/`,
        splashImageUrl: `${appUrl}/splash.png`,
        splashBackgroundColor: "#f7f7f7",
      },
    },
  };

  return [
    { title: `pinned cast for fid ${fid}` },
    { name: "fc:frame", content: JSON.stringify(frame) },
  ];
};

export const loader = async ({ context, params }: LoaderFunctionArgs) => {
  invariant(params.fid, "Invalid fid");

  const { env } = context.cloudflare;
  const { fid } = params;

  const count = await (async () => {
    try {
      return await incrCount(env);
    } catch {
      console.error("Redis error");
      return -1;
    }
  })();

  const imageUrl = config.dynamicOgImages
    ? ogImageUrl(Number(fid))
    : `${config.appUrl}/splash.png`;

  const linksResponse = await (async () => {
    const dbClient = db(env);
    if (!dbClient) return [];
    try {
      return await dbClient
        .selectFrom("links")
        .selectAll()
        .where("fid", "=", Number.parseInt(fid))
        .orderBy("order", "asc")
        .execute();
    } catch (error) {
      console.error("Database query failed:", error);
      return [];
    }
  })();
  const links =
    linksResponse.length > 0
      ? linksResponse.map((link) => ({
          label: link.label,
          url: link.url,
          link_type: link.label, // TODO: enhance
        }))
      : [
          {
            label: `FID ${fid}`,
            url: `https://vasco.wtf/fid/${fid}`,
            link_type: "Profile",
          },
          {
            label: "Github",
            url: config.githubUrl,
            link_type: "Github",
          },
        ];

  const walletsResponse = await (async () => {
    const dbClient = db(env);
    if (!dbClient) return [];
    try {
      return await dbClient
        .selectFrom("wallets")
        .selectAll()
        .where("fid", "=", Number.parseInt(fid))
        .orderBy("order", "asc")
        .execute();
    } catch (error) {
      console.error("Database query failed:", error);
      return [];
    }
  })();
  const wallets =
    walletsResponse.length > 0
      ? walletsResponse.map((wallet) => ({
          label: wallet.label,
          address: wallet.address,
          tooltip: wallet.tooltip,
        }))
      : [
          {
            label: "no wallets found",
            address: "0x000000000000000000000000000000000000dead",
            tooltip: "Wallet:",
          },
        ];

  const response: LoaderData = {
    myVar: env.MY_DEMO_VAR,
    fid: Number(fid),
    count,
    imageUrl,
    links,
    wallets,
  };

  return response;
};

export default function Pinned() {
  const { fid, myVar, count, links, wallets } = useLoaderData<typeof loader>();

  return (
    <div className="w-[300px] mx-auto py-4 px-2">
      <ClientOnly fallback={<div>Loading...</div>}>
        {() => (
          <div className="">
            <TopNavBar title="Linktree+" />
            <LinktreePlus fid={fid} links={links} />
            <WalletsList wallets={wallets} />
            <DevDemos myVar={myVar} fid={fid} count={count} />
          </div>
        )}
      </ClientOnly>
    </div>
  );
}
