import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";
import { ClientOnly } from "remix-utils/client-only";
import LandingPage from "~/components/LandingPage.client";
import PrivyWrapper from "~/components/PrivyWrapper.client";
import config from "~/config.json";
import { ogImageUrl } from "~/lib/og";
import type { User } from "~/services/oauth.server";
import { authSessionStorage } from "~/services/sessions.server";

export const meta: MetaFunction = () => {
  const appUrl = config.appUrl;
  const { title, description, name } = config.meta;

  const frame = {
    version: "next",
    imageUrl: config.dynamicOgImages ? ogImageUrl() : `${appUrl}/splash.png`,
    button: {
      title: config.button.title,
      action: {
        type: "launch_frame",
        name: name,
        url: `${appUrl}/`,
        splashImageUrl: `${appUrl}/splash.png`,
        splashBackgroundColor: "#f7f7f7",
      },
    },
  };

  return [
    { title },
    { description },
    { "og:title": title },
    { "og:type": "website" },
    { "og:image": `${appUrl}/icon.png` },
    { "og:url": appUrl },
    { name: "fc:frame", content: JSON.stringify(frame) },
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
