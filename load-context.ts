import { type PlatformProxy } from 'wrangler'
import { Env } from '~/type/env'

type Cloudflare = Omit<PlatformProxy<Env>, 'dispose'>

declare module '@remix-run/cloudflare' {
  interface AppLoadContext {
    cloudflare: Cloudflare
  }
}
