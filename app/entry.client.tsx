import { farcasterFrame } from "@farcaster/frame-wagmi-connector";
import { RemixBrowser } from "@remix-run/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StrictMode, startTransition } from "react";
import { hydrateRoot } from "react-dom/client";
import { WagmiProvider, createConfig, http } from "wagmi";
import { base, optimism } from "wagmi/chains";

const wagmiConfig = createConfig({
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
      <WagmiProvider config={wagmiConfig}>
        <QueryClientProvider client={queryClient}>
          <RemixBrowser />
        </QueryClientProvider>
      </WagmiProvider>
    </StrictMode>
  );
});
