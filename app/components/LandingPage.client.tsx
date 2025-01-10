import sdk from "@farcaster/frame-sdk";
import { usePrivy } from "@privy-io/react-auth";
import { useLoginToFrame } from "@privy-io/react-auth/farcaster";
import { RiLoginBoxLine } from "@remixicon/react";
import { useEffect, useState } from "react";
import { Button } from "~/components/ui/button";
import config from "~/config.json";
import useFrameSDK from "~/hooks/useFrameSDK";

const LandingPage = () => {
  const { isSDKLoaded, context } = useFrameSDK();
  const { ready, authenticated, login, logout, user } = usePrivy();
  const { initLoginToFrame, loginToFrame } = useLoginToFrame();
  const [fid, setFid] = useState<number>();

  useEffect(() => {
    if (context?.user?.fid) {
      setFid(context.user.fid);
    }
  }, [context]);

  // seamless Login to Frame with Privy. FYI this recipe only applies to this route
  useEffect(() => {
    if (config.privy.appId && ready && !authenticated) {
      const login = async () => {
        const { nonce } = await initLoginToFrame();
        const result = await sdk.actions.signIn({ nonce: nonce });
        await loginToFrame({
          message: result.message,
          signature: result.signature,
        });
      };
      login();
    }
  }, [ready, authenticated, initLoginToFrame, loginToFrame]);

  useEffect(() => {
    const redirect = () => {
      if (fid) {
        window.location.replace(`/pinned/${fid}`);
      }
    };

    if (fid) {
      redirect();
    }
  }, [fid]);

  const redirectRelativePath = fid ? `/pinned/${fid}` : "null";
  const name =
    user?.farcaster?.displayName ?? user?.farcaster?.username ?? "Fartcaster";

  return isSDKLoaded && (config.privy.appId ? ready : true) ? (
    <div className="p-4">
      <article className="prose">
        {config.privy.appId ? (
          <Button variant="secondary" onClick={authenticated ? logout : login}>
            {authenticated ? (
              <img
                src={user?.farcaster?.pfp ?? "/assets/farcaster.svg"}
                className="h-5 w-5"
                alt={name}
              />
            ) : (
              <img
                src="/assets/farcaster.svg"
                className="h-5 w-5"
                alt="Farcaster Logo"
              />
            )}
            {authenticated ? `Logout ${name}` : "Sign In With Privy"}
            {authenticated ? <RiLoginBoxLine /> : null}
          </Button>
        ) : null}
        <h3>{context ? `Gm, ${name}!` : "Landing page"}</h3>

        {context ? (
          <>
            <p>
              Hit Refresh in kebab menu, or use text link to navigate to{" "}
              <a href={redirectRelativePath}>{redirectRelativePath}</a>.
            </p>
            <pre>{JSON.stringify(context, null, 2)}</pre>
          </>
        ) : (
          <p>You do not appear to be viewing this from a Farcaster Frame v2.</p>
        )}
        <p>
          Try this <a href="/pinned/5650">view</a> of Vitalik's account.
        </p>
        <p>
          Nerdy details <a href="/nerds">here</a> 🤓.
        </p>
      </article>
    </div>
  ) : (
    <div>Loading...</div>
  );
};

export default LandingPage;
