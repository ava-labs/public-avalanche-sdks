import { AMPLIFY_CHAIN, BULLETIN_CHAIN, CONDUIT_CHAIN } from '@/constants/chains';

import { FancyAvatar } from './fancy-avatar';
import { memo, useState } from 'react';
import { LoadingButton } from './loading-button';
import { useMintAmplify } from '@/hooks/use-mint-amplify';
import { AutoAnimate } from '@/ui/auto-animate';
import { useAccount, useBalance } from 'wagmi';
import { MIN_AMOUNT_FOR_GAS } from '@/constants/token';
import { formatStringNumber } from '@/utils/format-string';
import { FlashingUpdate } from './flashing-update';
import { isNil } from 'lodash-es';
import { NotConnectedCard } from './not-connected-card';
import { OutOfGasCard } from './out-of-gas-card';
import { Card, CardContent } from '@/ui/card';
import type { EvmChain } from '@/types/chain';
import { useErc20Balance } from '@/hooks/use-erc20-balance';
import { cn } from '@/utils/cn';
import { TransactionSuccessAlert } from './transaction-success-alert';

const BalancesCard = ({ chain, isBigLayout = false }: { chain: EvmChain; isBigLayout?: boolean }) => {
  const { address } = useAccount();
  const { data: gasBalance } = useBalance({
    address,
    chainId: Number(chain.chainId),
  });

  const { formattedErc20Balance } = useErc20Balance({
    chain: chain,
    tokenAddress: chain.utilityContracts.demoErc20.address,
    decimals: chain.utilityContracts.demoErc20.decimals,
  });

  return (
    <Card className={cn('border-0 w-full', isBigLayout ? 'bg-neutral-800' : 'bg-neutral-900')}>
      <CardContent>
        <div className="flex flex-nowrap items-center">
          <FancyAvatar
            className="col-span-6 w-6 h-6"
            src={chain.logoUrl}
            label={chain.utilityContracts.demoErc20.symbol}
          />
          <p className="text-md font-medium ml-2">{chain.name}</p>
        </div>
        <div className={cn('mt-4 flex', isBigLayout ? 'align-center justify-around' : 'flex-col gap-2')}>
          <p className="whitespace-nowrap ">
            <FlashingUpdate className={cn('font-semibold ml-2', isBigLayout ? 'text-4xl' : 'text-xl')}>
              {formatStringNumber(gasBalance?.formatted ?? '0')}
            </FlashingUpdate>
            <span className="text-md text-neutral-400 font-semibold ml-1">{chain.networkToken.name}</span>
          </p>
          <p className="whitespace-nowrap">
            <FlashingUpdate className={cn('font-semibold ml-2', isBigLayout ? 'text-4xl' : 'text-xl')}>
              {formatStringNumber(formattedErc20Balance ?? '0')}
            </FlashingUpdate>
            <span className="text-md text-neutral-400 font-semibold ml-1">
              {chain.utilityContracts.demoErc20.symbol}
            </span>
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export const MintForm = memo(() => {
  const { address, isConnected } = useAccount();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mintTxHash, setMintTxHash] = useState<string>();

  const { mintToken } = useMintAmplify();

  const { refetch } = useErc20Balance({
    chain: AMPLIFY_CHAIN,
    tokenAddress: AMPLIFY_CHAIN.utilityContracts.demoErc20.address,
    decimals: AMPLIFY_CHAIN.utilityContracts.demoErc20.decimals,
  });

  const handleMint = async () => {
    setIsSubmitting(true);
    setMintTxHash(undefined);
    const response = await mintToken();
    setIsSubmitting(false);

    if (!response) {
      return;
    }

    setMintTxHash(response.hash);

    refetch();
  };

  const { data: gasBalance } = useBalance({
    address,
    chainId: Number(AMPLIFY_CHAIN.chainId),
  });
  const hasGas = !isNil(gasBalance) ? gasBalance.value > MIN_AMOUNT_FOR_GAS : true;
  return (
    <>
      <div className="grid grid-cols-12 gap-2">
        <div className="col-span-12">
          <BalancesCard
            chain={AMPLIFY_CHAIN}
            isBigLayout
          />
        </div>
        <div className="col-span-12 sm:col-span-6">
          <BalancesCard chain={BULLETIN_CHAIN} />
        </div>
        <div className="col-span-12 sm:col-span-6">
          <BalancesCard chain={CONDUIT_CHAIN} />
        </div>
      </div>
      <div className="mt-4">
        <LoadingButton
          variant={isConnected && hasGas ? 'default' : 'secondary'}
          className="w-full"
          isLoading={isSubmitting}
          onClick={handleMint}
          disabled={!isConnected || !hasGas}
        >
          MINT!
        </LoadingButton>
        <AutoAnimate>
          {!isConnected ? (
            <NotConnectedCard
              actionLabel="mint"
              className="mt-4"
            />
          ) : !hasGas ? (
            <OutOfGasCard
              chain={AMPLIFY_CHAIN}
              className="mt-4"
            />
          ) : null}
        </AutoAnimate>
        <AutoAnimate>
          {!!mintTxHash && (
            <TransactionSuccessAlert
              explorerBaseUrl={AMPLIFY_CHAIN.explorerUrl}
              txHash={mintTxHash}
              className="mt-4"
            />
          )}
        </AutoAnimate>
      </div>
    </>
  );
});
