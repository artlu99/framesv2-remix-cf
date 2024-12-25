import { farcasterFrame } from "@farcaster/frame-wagmi-connector";
import { RemixBrowser } from "@remix-run/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { startTransition, StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";
import { createConfig, http, WagmiProvider } from "wagmi";
import { base, optimism } from "wagmi/chains";

export const config = createConfig({
  chains: [base, optimism],
  transports: {
    [base.id]: http(),
    [optimism.id]: http(),
  },
  connectors: [farcasterFrame()],
});

const queryClient = new QueryClient();

startTransition(() => {
  hydrateRoot(
    document,
    <StrictMode>
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <RemixBrowser />
        </QueryClientProvider>
      </WagmiProvider>
    </StrictMode>
  );
});
