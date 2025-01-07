# Farcaster Frames V2 Starter on Remix and Cloudflare

- clone this repo
- install modules with `pnpm i` or similar
- update names in `package.json`, `wrangler.toml`
- update `/public/.well-known/farcaster.json`, including any iconography
- set up Neynar and Privy and update values in `app/config.json`
    - remember to enable seamless Farcaster login via [Privy settings](https://docs.privy.io/guide/react/recipes/misc/farcaster-frames#build-a-farcaster-frame-with-privy)
- set up Redis, Neon Postgres, and update environment variables in `.dev.vars` and `.env` (incl. secrets via Cloudflare dashboard)

Build + deploy to Cloudflare Pages using `pnpm wrangler deploy`. Assign DNS domain. Pay attention to the deployment branch, update in `package.json` as necessary.

Local development possible with `pnpm dev`. For features where you need the full Cloudflare environment (rarely), you need to first run `pnpm build` and then `pnpm start`.

# Features

1. deploy Remix on Cloudflare Pages, for light, fast SSR with exceptional DX and familiar React mental models
2. Hono Stack concepts for end-to-end type safety
3. Vite for local development with HMR; wrangler for local access to server-side features
4. incl. Kysely Typescript query builder and migration scripts
5. Upstash Redis and Neon Postgres batteries included
6. shadcn/ui (TailwindCSS) components, Framer motion animations
7. webhooks fully logged, optionally verified via Neynar (see [docs](https://docs.neynar.com/reference/fetch-notification-tokens) and send notifications [here](https://docs.neynar.com/reference/publish-frame-notifications))
8. Privy seamless sign-in [details](https://docs.privy.io/guide/react/recipes/misc/farcaster-frames#build-a-farcaster-frame-with-privy), as well as OAuth-style pathways with session-side cookies and example Github login 
9. MISSING: test suite, CI/CD

## a Frames V2 built on this starter 

https://frames.artlu.xyz/pinned/6546

https://frames.artlu.xyz/pinned/5650

## Notes

1. local dev has access to Redis and Postgres (both in prod), but not to dynamic OG image generation  
2. OG image generation is a separate microservice
3. Neon supports painless database branching, which is a great feature for development. Out of scope for this simplified starter.

## Thanks

- @horsefacts and @deodad https://framesv2.com
- [Yusuke Wada](https://github.com/yusukebe) for Hono
- [jiangsi](https://github.com/jiangsi) for Remix on Cloudflare Pages template 

## License

MIT
