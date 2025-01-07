import sdk from "@farcaster/frame-sdk";
import { usePrivy } from "@privy-io/react-auth";
import { useLoginToFrame } from "@privy-io/react-auth/farcaster";
import { useEffect } from "react";
import useFrameSDK from "~/hooks/useFrameSDK";

const LandingPage = () => {
  const { isSDKLoaded, context } = useFrameSDK();
  const { ready, authenticated, login, logout, user } = usePrivy();
  const { initLoginToFrame, loginToFrame } = useLoginToFrame();

  // seamless Login to Frame with Privy. FYI this recipe only applies to this route
  useEffect(() => {
    if (ready && !authenticated) {
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

  const name =
    user?.farcaster?.displayName ?? user?.farcaster?.username ?? "Fartcaster";

  const pISS = 62;

  return isSDKLoaded && ready ? (
    <div className="p-4">
      <article className="prose ">
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
        <h3>{context ? `Gm, ${name}!` : "Landing page"}</h3>

        <h1 className="dark:text-slate-100">🧑‍🚀🚽 {pISS}%</h1>
      </article>
    </div>
  ) : (
    <div>Loading...</div>
  );
};

export default LandingPage;
