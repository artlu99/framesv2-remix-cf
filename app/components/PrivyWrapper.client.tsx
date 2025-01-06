import { PrivyProvider } from "@privy-io/react-auth";
import config from "~/config.json";

const PrivyWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <PrivyProvider
      appId={config.privy?.appId ?? ""}
      config={{ loginMethods: ["farcaster"] }}
    >
      {children}
    </PrivyProvider>
  );
};

export default PrivyWrapper;
