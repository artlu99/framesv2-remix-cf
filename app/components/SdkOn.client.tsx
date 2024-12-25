import sdk, { type FrameContext } from "@farcaster/frame-sdk";
import {
  RiBlueskyLine,
  RiExternalLinkLine,
  RiGithubLine,
  RiHome4Line,
  RiTelegram2Line,
  RiTwitterXLine,
} from "@remixicon/react";
import { useCallback, useEffect, useState } from "react";
import { parseEther } from "viem";
import { useSendTransaction, useWaitForTransactionReceipt } from "wagmi";
import { Button } from "~/components/ui/button";
import config from "~/config.json";
import { Link } from "~/routes/pinned.$fid";

const makeLinktree = (links: Link[]) =>
  links.map((link) => ({
    ...link,
    icon:
      link.label === "Home page" ? (
        <RiHome4Line />
      ) : link.label === "Github" ? (
        <RiGithubLine />
      ) : link.label === "Twitter" ? (
        <RiTwitterXLine />
      ) : link.label === "Telegram" ? (
        <RiTelegram2Line />
      ) : link.label === "Bluesky" ? (
        <RiBlueskyLine />
      ) : (
        <RiExternalLinkLine />
      ),
  }));

interface SdkOnProps {
  links: Link[];
}
const SdkOn = (props: SdkOnProps) => {
  const { links } = props;
  const linktree = makeLinktree(links);

  const [isSDKLoaded, setIsSDKLoaded] = useState(false);
  const [context, setContext] = useState<FrameContext>();
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

  useEffect(() => {
    const load = async () => {
      setContext(await sdk.context);
      sdk.on("primaryButtonClicked", sendTx);

      await sdk.actions.setPrimaryButton({ text: "Send me ETH" });
      sdk.actions.ready({});
    };
    if (sdk && !isSDKLoaded) {
      setIsSDKLoaded(true);
      load();
    }
  }, [isSDKLoaded]);

  const openUrl = useCallback((idx: number) => {
    sdk.actions.openUrl(linktree[idx].url);
  }, []);

  const sendTx = useCallback(() => {
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

  return isSDKLoaded ? (
    <div className="flex">
      <div className="flex flex-col my-4 gap-2">
        {context ? (
          <div>Hello {context.user.displayName ?? "Fartcaster"}!</div>
        ) : null}
        {linktree.map((link, idx) => (
          <Button
            className="bg-warpcast-ui text-white"
            size="wide"
            onClick={() => openUrl(idx)}
            variant="secondary"
            key={"link-" + idx}
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
      </div>
    </div>
  ) : (
    <div>Loading...</div>
  );
};
export default SdkOn;
