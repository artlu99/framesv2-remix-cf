import type { MetaFunction } from "@remix-run/cloudflare";
import { ClientOnly } from "remix-utils/client-only";
import LandingPage from "~/components/LandingPage.client";
import PrivyWrapper from "~/components/PrivyWrapper.client";
import config from "~/config.json";

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

export default function Index() {
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
