import sdk, { type FrameContext } from "@farcaster/frame-sdk";
import { useEffect, useState } from "react";
import config from "~/config.json";

const useFrameSDK = () => {
  const [isSDKLoaded, setIsSDKLoaded] = useState(false);
  const [context, setContext] = useState<FrameContext>();

  useEffect(() => {
    const load = async () => {
      setContext(await sdk.context);
      sdk.on("primaryButtonClicked", () => sdk.actions.openUrl(config.githubUrl));
      await sdk.actions.setPrimaryButton({ text: "GH repo (FOSS)" });
      sdk.actions.ready({});
    };

    if (sdk && !isSDKLoaded) {
      setIsSDKLoaded(true);
      load();
    }
  }, [isSDKLoaded]);

  return { isSDKLoaded, context };
};

export default useFrameSDK;