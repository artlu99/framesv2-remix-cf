import { RiFileCopyLine } from "@remixicon/react";
import { Button } from "~/components/ui/button";
import { toast } from "~/hooks/use-toast";
import type { Wallet } from "~/type/linktreeTypes";

interface WalletsListProps {
  wallets: Wallet[];
}

const WalletsList = (props: WalletsListProps) => {
  const { wallets } = props;

  return (
    <article className="prose">
      {wallets.map((wallet) => (
        <Button
          key={wallet.label}
          variant="outline"
          className="flex w-full p-8 dark:text-gray-300 my-4"
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
          <div className="flex-1 text-left text-sm">
            <div>
              <span className="font-bold">{wallet.tooltip}</span> {wallet.label}
            </div>
            <div>
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
      ))}
    </article>
  );
};

export default WalletsList;
