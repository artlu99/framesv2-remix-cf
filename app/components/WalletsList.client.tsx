import { RiFileCopyLine } from "@remixicon/react";
import { Button } from "~/components/ui/button";
import { toast } from "~/hooks/use-toast";
import type { Wallet } from "~/routes/pinned.$fid";

interface WalletsListProps {
  wallets: Wallet[];
}

const WalletsList = (props: WalletsListProps) => {
  const { wallets } = props;

  return (
    <article className="prose">
      {wallets.map((wallet) => (
        <div
          key={wallet.label}
          className="flex gap-2 my-4 cursor-pointer"
          onClick={() => {
            navigator.clipboard.writeText(wallet.address);
            toast({
              title: `${wallet.tooltip}`,
              description: `copied to clipboard: ${wallet.address.slice(
                0,
                6
              )}...${wallet.address.slice(-4)}`,
            });
          }}
        >
          <Button
            variant="outline"
            className="flex w-full p-8 dark:text-gray-300"
          >
            <div className="flex-1 text-left text-sm">
              <div className="">
                <span className="font-bold">{wallet.tooltip}</span>{" "}
                {wallet.label}
              </div>
              <div className="">
                <span className="whitespace-nowrap flex items-center">
                  {wallet.address.length > 11
                    ? `${wallet.address.slice(0, 6)}...${wallet.address.slice(
                        -4
                      )}`
                    : wallet.address}
                  <RiFileCopyLine size="1em" className="ml-1" />
                </span>
              </div>
            </div>
          </Button>
        </div>
      ))}
    </article>
  );
};

export default WalletsList;
