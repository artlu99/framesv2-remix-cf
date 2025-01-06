import { type LoaderFunctionArgs, data, redirect } from "@remix-run/cloudflare";
import { authenticator } from "~/services/oauth.server";
import { authSessionStorage } from "~/services/sessions.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await authenticator.authenticate("github", request);

  if (!user) {
    console.error("Authentication failed: user is undefined");
    return data(request);
  }

  const session = await authSessionStorage.getSession(
    request.headers.get("cookie")
  );
  session.set("user", user);

  throw redirect("/pinned/3", {
    headers: { "Set-Cookie": await authSessionStorage.commitSession(session) },
  });
}
