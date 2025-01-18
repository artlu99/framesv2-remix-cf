# Farcaster Frames V2 Starter on Remix and Cloudflare

## Wat is dis

If you luurve `Next.js` on `Vercel`, check out [Demo](https://github.com/farcasterxyz/frames-v2-demo) by the Warpcast team.

If not, keep reading! 👇👇👇

This starter is meant for anyone who wants to quickly build a Farcaster Frame V2, with a focus on lightning-fast DX and gtm. It is not meant to showcase bleeding-edge features of the Frames v2 spec, nor to enable devs to re-build common Frames infrastructure such as auth or a notifications service.

## Local Development [~60 seconds to localhost:5173]

```sh
git clone https://github.com/artlu99/framesv2-remix-cf [your-folder-name]

cd [your-folder-name]

pnpm i

pnpm dev
```

## Deployment [~30 seconds to live]

### "Bish bash bingo bongo", a.k.a. accept the defaults and go

- update project name in `wrangler.toml`
- deploy to Cloudflare Pages using `pnpm run deploy`
- pay attention to the deployment branch name, update in `package.json` as necessary
- [ONE-TIME OPTIONAL, BUT RECOMMENDED]. Assign `Custom domain` via Cloudflare dashboard. Sign manifest in Warpcast, update `/public/.well-known/farcaster.json` and re-deploy

## Optional batteries included

***permissionless install, managed user notifications, auth, redis, postgres***

<details>
<summary>Click to expand/collapse</summary>

### Enable users to install your frame

- update `/public/.well-known/farcaster.json`
- icons can be changed later, but caching can cause issues / delays. *Avoid headaches later; try to get it right before Warpcast scrapes your site.*

### Managed notifications

- set up an app with [Neynar](https://dev.neynar.com/app). Details [[here]](https://docs.neynar.com/docs/send-notifications-to-frame-users)
- for local dev, update environment variable in `.dev.vars` (not checked into git, but follow `dev.vars.example`)
- update `NEYNAR_FRAME_WEBHOOK_URL` env variable as a secret via Cloudflare dashboard (do not use `wrangler.toml` for secrets!)

### Privy seamless Farcaster login

- set up an application with [Privy](https://dashboard.privy.io). Follow Steps 1 and 2 [[here]](https://docs.privy.io/guide/react/recipes/misc/farcaster-frames#build-a-farcaster-frame-with-privy). This starter implements Steps 3 and 4 for you!
- update `/app/config.json` with your Privy `appId`

### Redis

- set up an [Upstash Redis](https://upstash.com) instance via their dashboard
- this starter shares data across dev and prod environments. It does not expose the Redis connection to browsers; only the server-side Remix loader has access to it

<details>
<summary>Secrets setup</summary>

- copy **two (2)** secrets from the `REST API` -> `.env` section. Ensure you have copied the actual token, and not a bunch of asterisks to your clipboard (*don't ask me how I know!*)
- update secrets via Cloudflare dashboard (do not use `wrangler.toml` for secrets!)
- for local dev, update environment variables in `.dev.vars` (not checked into git, but follow `dev.vars.example`)

</details>

### Postgres

- set up [Neon Postgres](https://neon.tech) via their dashboard
- this starter shares data across dev and prod environments. It does not expose the Postgres connection to browsers; only the server-side Remix loader has access to it

<details>
<summary>Secrets setup</summary>

- copy **one (1)** secret from the `Connection Details` -> `Connection string` section
- update secrets via Cloudflare dashboard (do not use `wrangler.toml` for secrets!)
- for local dev, update environment variables in `.dev.vars` and `.env` (not checked into git, but follow the example files)
- run `pnpm run migrate` to create the database and tables

</details>

</details>

## Opinionated Features

This starter emphasizes iteration speed and type-safety.

It postpones scale decisions by leaning on serverless site generation, stateless connections and edge datastores.

It expects zero cost-to-launch, and the first bottleneck is expected to be the Privy plan (at ~150 users). Neynar is currently $9/month until much higher loads, and the plan includes many other useful features for Farcaster devs. Hosting and data should remain performant on the free tiers until much later. YMMV.

<details>

<summary>Click to expand/collapse a nerd list 🤓</summary>

1. `Remix` on `Cloudflare Pages`, for light, fast SSR with familiar `React` mental models. *Serverless that feels like a long-lived server*
2. `Vite` for lightning-fast local development with HMR
3. `Hono Stack` for end-to-end type safety, zero codegen and *de minimis* boilerplate
4. `Kysely` Typescript query builder and migration scripts
5. `shadcn/ui` `TailwindCSS` components, `Framer` motion animations
6. `Upstash Redis` and `Neon Postgres` as edge, scalable datastores on stateless connections
7. Seamless Farcaster login via `Privy` [[details]](https://docs.privy.io/guide/react/recipes/misc/farcaster-frames#build-a-farcaster-frame-with-privy), with easy pathway to providing embedded wallets
8. webhook logging, optionally verified and/or managed via `Neynar` (see [[docs]](https://docs.neynar.com/reference/fetch-notification-tokens)). Send managed notifications [[here]](https://docs.neynar.com/reference/publish-frame-notifications)
9. `Biome` linting  at the speed of Rust. `pnpm` because it's 2025.
10. BYO: test suite, CI/CD, local frame debugger

</details>

<details>
<summary>Click to expand/collapse a nerd table 🏓</summary>

## comparison with Warpcast Demo Repo

| Feature                     | artlu Starter                     | Warpcast Demo Repo               |
|-----------------------------|-----------------------------------|----------------------------------|
| Framework                   | Remix                             | Next App router                          |
| Local Development Tool      | Vite                              | Next                 |
| UI components                   | shadcn/ui                          | Radix + TailwindCSS                 |
| End-to-End Type Safety                 | Hono Stack                        | nah, we have Zod at home                    |
| Datastores                    | Upstash Redis, Neon Postgres (optional)    | Vercel KV (Redis)                    |
| Notifications               | Neynar (optional)                            | integrated + Neynar Hub verification                   |
| Authentication              | Privy (optional)                             | SIWF on NextAuth                  |
| Deployment                   | Cloudflare Pages                  | Vercel                           |
| Dynamic OG Generation     | separate microservice             | integrated                       |
| Linting and Formatting      | Biome                             | ESLint, Prettier                 |
| CI/CD                       | bring-your-own                     | Vercel + GitHub Actions (default)                   |
| testing                       | bring-your-own                     | bring-your-own                   |
| Edge Functions              | Yes                               | Yes                              |
| Cost Efficiency             | Free tiers recommended            | Free tiers recommended           |
| Philosophy             | serverless V8            | long-lived Node server + Edge serverless           |

</details>

## Some Frames V2 built on this starter

1. https://frames.artlu.xyz/pinned/6546 (artlu) and https://frames.artlu.xyz/pinned/5650 (Vitalik)

2. https://pisss.artlu.xyz/

### Notes

1. dynamic OG image generation is a separate microservice. FOSS and MIT Licensed [[here]](https://github.com/artlu99/cached-dynamic-og-generator-cf).
2. Neon supports painless database branching, which is a great feature for development. Out of scope for this starter.
3. when you need the full Cloudflare environment, first run `pnpm build` and then `pnpm start` *(this should be rare)*.

## Thanks

- [@horsefacts](https://github.com/horsefacts), [@deodad](https://github.com/deodad) and [@cmlad](https://github.com/cmlad) for [Demo](https://github.com/farcasterxyz/frames-v2-demo) and https://framesv2.com
- [jiangsi](https://github.com/jiangsi) for Remix on Cloudflare Pages template
- [Yusuke Wada](https://github.com/yusukebe) for Hono 🔥

## License

MIT
