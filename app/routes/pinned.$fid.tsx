import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";
import { RiFileCopyLine } from "@remixicon/react";
import { ClientOnly } from "remix-utils/client-only";
import invariant from "tiny-invariant";
import { ModeToggle } from "~/components/mode-toggle";
import SdkOn from "~/components/SdkOn.client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";
import { Button } from "~/components/ui/button";
import config from "~/config.json";
import { toast } from "~/hooks/use-toast";
import { db } from "~/lib/postgres";
import { incrCount } from "~/lib/redis";

export interface Link {
  label: string;
  url: string;
}

interface Wallet {
  label: string;
  address: string;
  tooltip: string;
}
interface LoaderData {
  myVar: string;
  fid: number;
  count: number;
  links: Link[];
  wallets: Wallet[];
}

export const meta: MetaFunction = ({ data }) => {
  const fid = (data as unknown as LoaderData).fid ?? 6546;

  // https://docs.farcaster.xyz/developers/frames/v2/spec
  const appUrl = config.appUrl;
  const name = config.meta.name;
  const frame = {
    version: "next",
    imageUrl: config.dynamicOgImages
      ? `${config.dynamicOgService.baseUrl}?mainText=${
          fid == config.fid ? config.dynamicOgService.params.mainText : fid
        }&description=${
          config.dynamicOgService.params.description
        }&footerText=${config.dynamicOgService.params.footerText}&style=${
          config.dynamicOgService.params.style
        }`
      : `${appUrl}/splash.png`,
    button: {
      title: config.button.title,
      action: {
        type: "launch_frame",
        name: name,
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

  const linksResponse = await (async () => {
    try {
      return await db(env)
        .selectFrom("links")
        .selectAll()
        .where("fid", "=", parseInt(fid))
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
        }))
      : [
          {
            label: `FID ${fid}`,
            url: `https://vasco.wtf/fid/${fid}`,
          },
        ];

  const dbResponse = await (async () => {
    try {
      return await db(env)
        .selectFrom("wallets")
        .selectAll()
        .where("fid", "=", parseInt(fid))
        .orderBy("order", "asc")
        .execute();
    } catch (error) {
      console.error("Database query failed:", error);
      return [];
    }
  })();
  const wallets =
    dbResponse.length > 0
      ? dbResponse.map((wallet) => ({
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

  return Response.json({
    myVar: env.MY_VAR,
    fid,
    count,
    links,
    wallets,
  }) as unknown as LoaderData;
};

export default function Index() {
  const { fid, myVar, count, links, wallets } = useLoaderData<typeof loader>();

  return (
    <div className="w-[300px] mx-auto py-4 px-2">
      <nav className="flex justify-between bg-base-200 p-2">
        <div className="flex items-center flex-shrink-0">
          <a href="/">
            <img
              className="h-8 w-auto"
              src="/assets/farcaster.svg"
              alt="Farcaster"
            />
          </a>
          <span className="ml-3 text-sm">Linktree+</span>
        </div>
        <div className="ml-auto">
          <ModeToggle />
        </div>
      </nav>
      <ClientOnly fallback={<div>Loading...</div>}>
        {() => <SdkOn links={links} />}
      </ClientOnly>
      <article className="prose">
        {wallets.map((wallet) => (
          <div
            key={wallet.label}
            className="flex gap-2 my-4 cursor-pointer"
            onClick={() => {
              navigator.clipboard.writeText(wallet.address);
              toast({
                title: `${wallet.tooltip}`,
                description: `copied to clipboard: ${wallet.address.slice(
                  0,
                  6
                )}...${wallet.address.slice(-4)}`,
              });
            }}
          >
            <Button
              variant="outline"
              className="flex w-full p-8 dark:text-gray-300"
            >
              <div className="flex-1 text-left text-sm">
                <div className="">
                  <span className="font-bold">{wallet.tooltip}</span>{" "}
                  {wallet.label}
                </div>
                <div className="">
                  <span className="whitespace-nowrap flex items-center">
                    {wallet.address.length > 11
                      ? `${wallet.address.slice(0, 6)}...${wallet.address.slice(
                          -4
                        )}`
                      : wallet.address}
                    <RiFileCopyLine size="1em" className="ml-1" />
                  </span>
                </div>
              </div>
            </Button>
          </div>
        ))}
      </article>
      <hr />
      <Accordion type="single" collapsible>
        <AccordionItem value="item-1">
          <AccordionTrigger>Dev demos</AccordionTrigger>
          <AccordionContent>
            <article className="prose my-4 dark:text-gray-300">
              <ul>
                <li>myVar: {myVar}</li>
                <li>fid: {fid}</li>
                <li>count: {count}</li>
              </ul>
            </article>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
