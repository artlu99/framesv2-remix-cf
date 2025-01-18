import { PrivyProvider } from "@privy-io/react-auth";
import config from "~/config.json";

export const PrivyWrapper = ({ children }: { children: React.ReactNode }) => {
  return config.privy?.appId ? (
    <PrivyProvider
      appId={config.privy.appId ?? ""}
      config={{ loginMethods: ["farcaster"] }}
    >
      {children}
    </PrivyProvider>
  ) : (
    <>{children}</>
  );
};
