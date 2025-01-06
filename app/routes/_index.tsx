import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/cloudflare";
import { Form, useLoaderData } from "@remix-run/react";
import { RiGithubLine } from "@remixicon/react";
import { ClientOnly } from "remix-utils/client-only";
import LandingPage from "~/components/LandingPage.client";
import PrivyWrapper from "~/components/PrivyWrapper.client";
import { Button } from "~/components/ui/button";
import config from "~/config.json";
import type { User } from "~/services/oauth.server";
import { authSessionStorage } from "~/services/sessions.server";

export const meta: MetaFunction = () => {
  const appUrl = config.appUrl;
  const { title, description } = config.meta;

  return [
    { title },
    { description },
    { "og:title": title },
    { "og:type": "website" },
    { "og:image": `${appUrl}/icon.png` },
    { "og:url": appUrl },
  ];
};

interface LoaderData {
  user: User | null;
}
export async function loader({
  request,
}: LoaderFunctionArgs): Promise<LoaderData> {
  const session = await authSessionStorage.getSession(
    request.headers.get("cookie")
  );
  const user = session.get("user") as User | null;
  return { user };
}

export default function Index() {
  const { user } = useLoaderData<typeof loader>();

  return (
    <div className="w-[300px] mx-auto py-4 px-2">
      <div>
        {config.github?.showButton ? (
          user ? (
            <Form action="/auth/logout" method="post">
              <Button variant={"secondary"}>
                <img
                  src={user.avatar_url}
                  className="h-5 w-5"
                  alt="Github Avatar"
                />
                Logout
              </Button>
            </Form>
          ) : (
            <Form action="/auth/github" method="post">
              <Button variant={"secondary"}>
                <RiGithubLine />
                Login with GitHub
              </Button>
            </Form>
          )
        ) : null}
      </div>

      <ClientOnly fallback={<div>Loading...</div>}>
        {() => (
          <PrivyWrapper>
            <LandingPage />
          </PrivyWrapper>
        )}
      </ClientOnly>
    </div>
  );
}
