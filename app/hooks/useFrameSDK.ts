import sdk, { type FrameContext } from "@farcaster/frame-sdk";
import { useEffect, useState } from "react";

const useFrameSDK = () => {
  const [isSDKLoaded, setIsSDKLoaded] = useState(false);
  const [context, setContext] = useState<FrameContext>();

  useEffect(() => {
    const load = async () => {
      setContext(await sdk.context);
      sdk.on("primaryButtonClicked", () => sdk.actions.close());
      await sdk.actions.setPrimaryButton({ text: "Goodbye" });
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