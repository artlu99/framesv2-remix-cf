import sdk, { type FrameContext } from "@farcaster/frame-sdk";
import {
  RiBlueskyLine,
  RiExternalLinkLine,
  RiGithubLine,
  RiHome4Line,
  RiLinkedinLine,
  RiRssLine,
  RiSendPlaneFill,
  RiTelegram2Line,
  RiTwitterXLine,
} from "@remixicon/react";
import { motion } from "framer-motion";
import { useCallback, useState } from "react";
import { parseEther } from "viem";
import { useSendTransaction, useWaitForTransactionReceipt } from "wagmi";
import { Button } from "~/components/ui/button";
import config from "~/config.json";
import useFrameSDK from "~/hooks/useFrameSDK";
import { ogImageUrl } from "~/lib/og";
import type { Link } from "~/routes/pinned.$fid";

const makeLinktree = (links: Link[]) =>
  links.map((link) => ({
    ...link,
    icon:
      link.label === "Home page" ? (
        <RiHome4Line />
      ) : link.label === "Github" ? (
        <RiGithubLine />
      ) : link.label === "Twitter" || link.label === "X" ? (
        <RiTwitterXLine />
      ) : link.label === "LinkedIn" ? (
        <RiLinkedinLine />
      ) : link.label === "Telegram" ? (
        <RiTelegram2Line />
      ) : link.label === "Bluesky" ? (
        <RiBlueskyLine />
      ) : link.label === "RSS" ? (
        <RiRssLine />
      ) : (
        <RiExternalLinkLine />
      ),
  }));

interface LinktreePlusProps {
  fid: number;
  links: Link[];
}
const LinktreePlus = (props: LinktreePlusProps) => {
  const { fid, links } = props;
  const linktree = makeLinktree(links);

  const { isSDKLoaded, context } = useFrameSDK();

  const [isSplashOpen, setIsSplashOpen] = useState(false);
  const [txHash, setTxHash] = useState<`0x${string}` | undefined>();

  const {
    sendTransaction,
    error: sendTxError,
    isError: isSendTxError,
    isPending: isSendTxPending,
  } = useSendTransaction();

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash: txHash as `0x${string}`,
    });

  const openUrl = useCallback(
    (idx: number, context?: FrameContext) => {
      context
        ? sdk.actions.openUrl(linktree[idx].url)
        : window.open(linktree[idx].url, "_blank");
    },
    [linktree]
  );

  const sendEth = useCallback(() => {
    sendTransaction(
      {
        to: config.CTA.address as `0x${string}`,
        value: parseEther(config.CTA.value),
      },
      {
        onSuccess: (hash) => {
          setTxHash(hash);
        },
      }
    );
  }, [sendTransaction]);

  const toggleSplash = useCallback(() => {
    setIsSplashOpen((prev) => !prev);
  }, []);

  return isSDKLoaded ? (
    <div className="flex">
      <div className="flex flex-col my-4 gap-2">
        {context ? (
          <div>
            <p>Hello, {context.user.displayName ?? "Fartcaster"}!</p>

            <p>
              (via{" "}
              {context.client?.clientFid === 9152
                ? "Warpcast"
                : context.client?.clientFid ?? "alt client"}
              )
            </p>

            <button
              onClick={toggleSplash}
              className="flex items-center gap-2 transition-colors"
            >
              <span
                className={`transform transition-transform ${
                  isSplashOpen ? "rotate-90" : ""
                }`}
              >
                ➤
              </span>
              FID: {fid}
            </button>

            {isSplashOpen && (
              <img
                src={ogImageUrl(fid)}
                alt={"dynamic OG image"}
                width={300}
                height={200}
              />
            )}
          </div>
        ) : null}
        {linktree.map((link, idx) => (
          <Button
            className="bg-warpcast-ui text-white"
            size="wide"
            onClick={() => openUrl(idx, context)}
            variant="secondary"
            key={`link-${idx}`}
          >
            {idx % 2 === 0 ? (
              <>
                {link.icon} {link.label}
              </>
            ) : (
              <>
                {link.label} {link.icon}
              </>
            )}
          </Button>
        ))}
        <div className=" my-4 justify-center">
          <motion.button
            className="bg-zinc-600 text-white inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 h-10 w-64 max-w-[20rem] bg-secondary text-secondary-foreground shadow-sm"
            onClick={sendEth}
            key={"CTA-1"}
            whileTap={{ scale: 1.5 }}
          >
            <RiSendPlaneFill />
            {config.CTA.value} ETH
          </motion.button>

          <p className="text-xs text-neutral-300">e.g., wallet txn to dev</p>
        </div>
      </div>
    </div>
  ) : (
    <div>Loading...</div>
  );
};
export default LinktreePlus;
