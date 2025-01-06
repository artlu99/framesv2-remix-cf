import { type ActionFunctionArgs, redirect } from "@remix-run/cloudflare";
import { authSessionStorage } from "~/services/sessions.server";

export async function loader() {
  return redirect("/");
}

export async function action({ request }: ActionFunctionArgs) {
  const session = await authSessionStorage.getSession(
    request.headers.get("cookie")
  );
  const destroyed = await authSessionStorage.destroySession(session);

  return redirect("/", {
    headers: { "Set-Cookie": destroyed },
  });
}
