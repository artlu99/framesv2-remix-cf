import sdk, { type FrameContext } from "@farcaster/frame-sdk";
import {
  type ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

interface FrameSDKContextType {
  isSDKLoaded: boolean;
  context: FrameContext | undefined;
}

const FrameSDKContext = createContext<FrameSDKContextType | undefined>(
  undefined
);

export function FrameSDKProvider({ children }: { children: ReactNode }) {
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

  return (
    <FrameSDKContext.Provider value={{ isSDKLoaded, context }}>
      {children}
    </FrameSDKContext.Provider>
  );
}

export function useFrameSDK() {
  const context = useContext(FrameSDKContext);
  if (context === undefined) {
    throw new Error("useFrameSDK must be used within a FrameSDKProvider");
  }
  return context;
}
