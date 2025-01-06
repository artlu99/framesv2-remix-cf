import { redirect } from "@remix-run/cloudflare";
import { authSessionStorage } from "~/services/sessions.server";

export async function authenticate(request: Request, returnTo?: string) {
  const session = await authSessionStorage.getSession(
    request.headers.get("cookie")
  );
  const user = session.get("user");
  if (user) {
    return user;
  }
  if (returnTo) {
    session.set("returnTo", returnTo);
  }
  throw redirect("/", {
    headers: { "Set-Cookie": await sessionStorage.commitSession(session) },
  });
}
