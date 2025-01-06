import { type ActionFunctionArgs, redirect } from "@remix-run/cloudflare";
import { authenticator } from "~/services/oauth.server";

export async function loader() {
  return redirect("/");
}

export async function action({ request }: ActionFunctionArgs) {
  await authenticator.authenticate("github", request);
}
