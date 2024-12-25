import devServer, { defaultOptions } from '@hono/vite-dev-server';
import adapter from '@hono/vite-dev-server/cloudflare';
import { vitePlugin as remix } from '@remix-run/dev';
import { cloudflareDevProxyVitePlugin } from "@remix-run/dev/dist/vite/cloudflare-proxy-plugin";
import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  ssr: {
    noExternal: ['@farcaster/frame-sdk'],
    resolve: {
      externalConditions: ['workerd', 'worker']
    }
  },
  plugins: [
    cloudflareDevProxyVitePlugin(),
    remix(),
    devServer({
      adapter,
      entry: 'server.ts',
      exclude: [...defaultOptions.exclude, '/assets/**', '/app/**'],
      injectClientScript: false
    })
  ],
  resolve: {
    alias: {
      '@root': path.resolve(__dirname, './'),
      '@cf-workers': path.resolve(__dirname, './functions'),
      '~': path.resolve(__dirname, './app')
    }
  }
})
