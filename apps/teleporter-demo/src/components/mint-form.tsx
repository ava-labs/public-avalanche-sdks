import { AMPLIFY_CHAIN } from '@/constants/chains';

import { FancyAvatar } from './fancy-avatar';
import { memo, useState } from 'react';
import { LoadingButton } from './loading-button';
import { useBalances } from '@/providers/balances-provider';
import { useMintAmplify } from '@/hooks/use-mint-amplify';
import { AutoAnimate } from '@/ui/auto-animate';
import { useAccount } from 'wagmi';
import { ConnectWalletCard } from './connect-wallet-card';
import { GoToFaucet } from './go-to-faucet';

export const MintForm = memo(() => {
  const { isConnected } = useAccount();

  const { tokensMap } = useBalances();
  // const gasToken = tokensMap?.get(AMPLIFY_CHAIN.networkToken.universalTokenId);
  const erc20Token = tokensMap?.get(AMPLIFY_CHAIN.utilityContracts.nativeErc20.universalTokenId);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const { mintToken } = useMintAmplify();

  const handleMint = async () => {
    setIsSubmitting(true);
    await mintToken();
    setIsSubmitting(false);
  };

  // return <GoToFaucet chain={AMPLIFY_CHAIN} />;

  return (
    <div className="flex flex-col gap-2 w-48 justify-center items-center">
      {!isConnected ? (
        <ConnectWalletCard />
      ) : false ? (
        // TODO: detect balance and show GoToFaucet if low
        <GoToFaucet chain={AMPLIFY_CHAIN} />
      ) : (
        <>
          <AutoAnimate>
            <p className="text-gray-400 text-sm text-center">Current Balance:</p>
            <div className="flex items-center justify-center space-x-2 flex-nowrap mb-2">
              <span className="text-3xl font-semibold">{erc20Token?.displayBalance}</span>
              <FancyAvatar
                src={AMPLIFY_CHAIN.logoUrl}
                label={AMPLIFY_CHAIN.utilityContracts.nativeErc20.symbol}
                className="w-6 h-6"
              />
              <span className="text-lg font-semibold">{AMPLIFY_CHAIN.utilityContracts.nativeErc20.symbol}</span>{' '}
            </div>
          </AutoAnimate>
          <LoadingButton
            className="w-full"
            isLoading={isSubmitting}
            onClick={handleMint}
          >
            MINT!
          </LoadingButton>
        </>
      )}
    </div>
  );
});
