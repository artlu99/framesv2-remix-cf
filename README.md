# Farcaster Frames V2 Starter on Remix and Cloudflare


- update `app/config.json`
- update `/public/.well-known/farcaster.json`
- set up Redis and Neon Postgres and update env vars (incl. secrets via Cloudflare dashboard)

Build + deploy to Cloudflare Pages, following `package.json` and `wrangler.toml`

# Features

1. deploy Remix on Cloudflare Pages, for light, fast SSR with exceptional DX and familiar React mental models
2. Hono Stack concepts for end-to-end type safety
3. Vite for local development with HMR; wrangler for local access to server-side features
4. incl. Kysely Typescript query builder and migration scripts
5. Upstash Redis and Neon Postgres batteries included
6. TailwindCSS and shadcn/ui for styling
7. front-end auth is ready for Neynar, Privy or Dynamic (follow their React tutorials)

## a Frames V2 built on this starter 

https://frames.artlu.xyz/pinned/6546

https://frames.artlu.xyz/pinned/5650

## Notes

1. local dev has access to Redis, but not to Postgres or dynamic OG image generation 
2. use wrangler for developing locally against live database
3. OG image generation is a separate microservice


## Thanks

- @horsefacts and @deodad https://framesv2.com
- [Yusuke Wada](https://github.com/yusukebe) for Hono
- [jiangsi](https://github.com/jiangsi) for Remix on Cloudflare Pages template 

## License

MIT
