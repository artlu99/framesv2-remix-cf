import devServer, { defaultOptions } from "@hono/vite-dev-server";
import adapter from "@hono/vite-dev-server/cloudflare";
import { vitePlugin as remix } from "@remix-run/dev";
import { cloudflareDevProxyVitePlugin } from "@remix-run/dev/dist/vite/cloudflare-proxy-plugin";
import path from "node:path";
import { defineConfig } from "vite";

export default defineConfig({
  ssr: {
    noExternal: ["@farcaster/frame-sdk"],
    resolve: {
      externalConditions: ["workerd", "worker"],
    },
  },
  plugins: [
    cloudflareDevProxyVitePlugin(),
    remix({
      future: {
        v3_fetcherPersist: true,
        v3_relativeSplatPath: true,
        v3_throwAbortReason: true,
        v3_singleFetch: true,
        v3_lazyRouteDiscovery: true,
      },
      // Add this to handle .client suffix
      ignoredRouteFiles: ["**/.*", "**/*.client.*"],
    }),
    devServer({
      adapter,
      entry: "server.ts",
      exclude: [...defaultOptions.exclude, "/assets/**", "/app/**"],
      injectClientScript: false,
    }),
  ],
  resolve: {
    alias: {
      "@root": path.resolve(__dirname, "./"),
      "@cf-workers": path.resolve(__dirname, "./functions"),
      "~": path.resolve(__dirname, "./app"),
    },
  },
});
