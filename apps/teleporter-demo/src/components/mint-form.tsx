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
import { MIN_AMOUNT_FOR_GAS } from '@/constants/token';
import { bigToDisplayString } from '@/utils/big-to-display-string';
import { sleep } from '@/utils/sleep';
import { FlashingUpdate } from './flashing-update';
import { isNil } from 'lodash-es';
import { Button } from '@/ui/button';
import { ArrowLeftIcon, CheckCircle } from 'lucide-react';

export const MintForm = memo(() => {
  const { isConnected } = useAccount();

  const { tokensMap, mutate } = useBalances();
  const gasToken = tokensMap?.get(AMPLIFY_CHAIN.networkToken.universalTokenId);
  const erc20Token = tokensMap?.get(AMPLIFY_CHAIN.utilityContracts.demoErc20.universalTokenId);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mintTxHash, setMintTxHash] = useState<string>();

  const { mintToken } = useMintAmplify();

  const handleMint = async () => {
    setIsSubmitting(true);
    const response = await mintToken();
    setIsSubmitting(false);

    if (!response) {
      return;
    }

    setMintTxHash(response.hash);

    // Wait 1s to let glacier index
    await sleep(1000);
    mutate();
  };

  // return <GoToFaucet chain={AMPLIFY_CHAIN} />;

  console.log('gasToken?.balance.toString()', gasToken?.balance.toString());

  return (
    <div className="flex flex-col gap-2 w-48 justify-center items-center">
      {!isConnected ? (
        <ConnectWalletCard />
      ) : gasToken?.balance.lt(MIN_AMOUNT_FOR_GAS) ? (
        // TODO: detect balance and show GoToFaucet if low
        <GoToFaucet chain={AMPLIFY_CHAIN} />
      ) : (
        <>
          <AutoAnimate>
            <p className="text-gray-400 text-sm text-center">Current Balance:</p>
            <div className="flex items-center justify-center space-x-2 flex-nowrap mb-2">
              <FlashingUpdate className="text-3xl font-semibold">
                {bigToDisplayString(erc20Token?.balance)}
              </FlashingUpdate>
              <FancyAvatar
                src={AMPLIFY_CHAIN.logoUrl}
                label={AMPLIFY_CHAIN.utilityContracts.demoErc20.symbol}
                className="w-6 h-6"
              />
              <span className="text-lg font-semibold">{AMPLIFY_CHAIN.utilityContracts.demoErc20.symbol}</span>
            </div>
          </AutoAnimate>
          {!isNil(mintTxHash) ? (
            <div className="flex flex-col items-center gap-2">
              <span className="inline-flex flex-nowrap text-xl font-semibold text-gray-300 mb-2">
                <CheckCircle
                  className="text-green-500 mr-2"
                  size={24}
                />{' '}
                Mint Success!
              </span>

              <Button
                className="w-full"
                variant="secondary"
              >
                <ArrowLeftIcon
                  className="mr-2"
                  size={16}
                />
                Go to Teleporter
              </Button>
              <Button
                className="w-full h-8"
                variant="link"
                onClick={() => setMintTxHash(undefined)}
              >
                Reset
              </Button>
            </div>
          ) : (
            <LoadingButton
              className="w-full"
              isLoading={isSubmitting}
              onClick={handleMint}
            >
              MINT!
            </LoadingButton>
          )}
        </>
      )}
    </div>
  );
});
