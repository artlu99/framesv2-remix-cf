import type { OAuth2Tokens } from "arctic";
import { Authenticator } from "remix-auth";
import { GitHubStrategy } from "remix-auth-github";
import config from "~/config.json";

export const authenticator = new Authenticator();

authenticator.use(
  new GitHubStrategy(
    {
      clientId: config.github?.clientId,
      clientSecret: config.github?.clientSecret,
      redirectURI: new URL(`${config.appUrl}/auth/github/callback`).toString(),
      scopes: ["user:email"],
    },
    async ({ tokens }) => {
      const user = await getUser(tokens);
      return user;
    }
  ),
  "github"
);

export interface User {
  login: string;
  id: number;
  avatar_url: string;
  type: string;
  user_view_type: string;
  site_admin: boolean;
}

async function getUser(tokens: OAuth2Tokens): Promise<User | null> {
  const accessToken = tokens.accessToken();
  if (!accessToken) {
    console.error("Access token not found");
    return null;
  }

  const response = await fetch("https://api.github.com/user", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!response.ok) {
    console.error("error:", response.status, response.statusText);
    // Github APIs may block Cloudflare IPs, so we mock this for debugging
    return config.github?.debug
      ? {
          login: "replace-with-your-username",
          id: 99999999,
          avatar_url: "https://i.sstatic.net/frlIf.png",
          type: "User",
          user_view_type: "public",
          site_admin: false,
        }
      : null;
  }

  const user = (await response.json()) as unknown as User;
  return user;
}
