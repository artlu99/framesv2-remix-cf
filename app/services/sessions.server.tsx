import { createCookieSessionStorage } from "@remix-run/cloudflare";
import { createThemeSessionResolver } from "remix-themes";
import config from "~/config.json";

// You can default to 'development' if process.env.NODE_ENV is not set
const isProduction = import.meta.env.MODE === "production";

const sessionStorage = (name: string) =>
  createCookieSessionStorage({
    cookie: {
      name,
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      secrets: ["s3cr3t"],
      // Set domain and secure only if in production
      ...(isProduction ? { domain: config.prodDomain, secure: true } : {}),
    },
  });

export const themeSessionResolver = createThemeSessionResolver(
  sessionStorage("theme")
);

export const authSessionStorage = sessionStorage("_session");