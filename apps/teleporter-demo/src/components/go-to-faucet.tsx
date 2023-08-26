import type { EvmChain } from '@/types/chain';
import { TokenAvatarAndSymbol } from './token-avatar-and-symbol';
import { buttonVariants } from '@/ui/button';
import { ExternalLink } from 'lucide-react';
import { cn } from '@/utils/cn';

export const GoToFaucet = ({ chain }: { chain: EvmChain }) => {
  return (
    <>
      <div className="flex flex-col items-center w-full ">
        <p className="text-center text-gray-400 text-sm">
          Out of gas! <br />
          Mint{' '}
          <TokenAvatarAndSymbol
            src={chain.logoUrl}
            symbol={chain.networkToken.symbol}
            className="items-baseline mx-1"
            avatarProps={{
              className: 'w-4 h-4',
            }}
          />{' '}
          to transact.
        </p>
        <a
          className={cn(buttonVariants({ variant: 'link' }), 'h-12 -mb-4')}
          href={chain.faucetUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          MINT
          <TokenAvatarAndSymbol
            src={chain.logoUrl}
            symbol={chain.networkToken.symbol}
            className="mx-1"
            avatarProps={{
              className: 'w-4 h-4',
            }}
          />
          <ExternalLink size={16} />
        </a>
      </div>
    </>
  );
};
