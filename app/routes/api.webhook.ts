import type { ActionFunctionArgs } from "@remix-run/cloudflare";

export const loader = async () => {
  return new Response("Method not allowed", { status: 405 });
}

export const action = async ({ request, context }: ActionFunctionArgs) => {
  if (request.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  const payload = await request.json();
  console.log({webhook: payload});

  // possible post to Neynar
  const { env } = context.cloudflare;
  if (env.NEYNAR_FRAME_WEBHOOK_URL === undefined) {
    console.log("NEYNAR_FRAME_WEBHOOK_URL is not set");
    return new Response("OK", { status: 200 });
  }
  try {
    await fetch(env.NEYNAR_FRAME_WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    
  } catch (error) {
    console.error("Neynar error:", error);
  }
  return new Response("OK", { status: 200 });
};
