import { TELEPORTER_CONFIG, type EvmTeleporterChain } from '@/constants/chains';

import { FancyAvatar } from './fancy-avatar';
import { memo, useMemo, useState } from 'react';
import { LoadingButton } from './loading-button';
import { useMintTlp } from '@/hooks/use-mint-tlp';
import { AutoAnimate } from '@/ui/auto-animate';
import { useAccount, useBalance } from 'wagmi';
import { MIN_AMOUNT_FOR_GAS } from '@/constants/token';
import { formatStringNumber } from '@/utils/format-string';
import { FlashingUpdate } from './flashing-update';
import { isNil } from 'lodash-es';
import { NotConnectedCard } from './not-connected-card';
import { OutOfGasCard } from './out-of-gas-card';
import { Card, CardContent } from '@/ui/card';
import { useErc20Balance } from '@/hooks/use-erc20-balance';
import { cn } from '@/utils/cn';
import { TransactionSuccessAlert } from './transaction-success-alert';
import { buttonVariants } from '@/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { useSwitchChain } from '@/hooks/use-switch-chain';

const BalancesCard = ({ chain, isBigLayout = false }: { chain: EvmTeleporterChain; isBigLayout?: boolean }) => {
  const { address } = useAccount();
  const { data: gasBalance } = useBalance({
    address,
    chainId: Number(chain.chainId),
  });

  const { formattedErc20Balance } = useErc20Balance({
    chain,
  });

  return (
    <Card className={cn('border-0 w-full', isBigLayout ? 'bg-neutral-800' : 'bg-neutral-900')}>
      <CardContent>
        <div className="flex flex-nowrap items-center">
          <FancyAvatar
            className="col-span-6 w-6 h-6"
            src={chain.logoUrl}
            label={chain.contracts.teleportedErc20.symbol}
          />
          <p className="text-md font-medium ml-2">{chain.name}</p>
        </div>
        <div
          className={cn(
            'mt-4 flex gap-2',
            isBigLayout ? 'sm:flex-row flex-col align-center justify-around' : 'flex-col',
          )}
        >
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
              {chain.contracts.teleportedErc20.symbol}
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

  const { mintToken } = useMintTlp();

  const { refetch } = useErc20Balance({
    chain: TELEPORTER_CONFIG.tlpMintChain,
  });

  const { switchChain } = useSwitchChain();
  const handleMint = async () => {
    setIsSubmitting(true);
    setMintTxHash(undefined);
    try {
      await switchChain(TELEPORTER_CONFIG.tlpMintChain);
      const txHash = await mintToken();
      setIsSubmitting(false);
      setMintTxHash(txHash);
      refetch();
    } catch (error) {
      console.error(error);
      setIsSubmitting(false);
      return;
    }
  };

  const { data: gasBalance } = useBalance({
    address,
    chainId: Number(TELEPORTER_CONFIG.tlpMintChain.chainId),
  });
  const hasGas = !isNil(gasBalance) ? gasBalance.value > MIN_AMOUNT_FOR_GAS : true;

  const nonMintingChains = useMemo(
    () => TELEPORTER_CONFIG.chains.filter((chain) => chain.chainId !== TELEPORTER_CONFIG.tlpMintChain.chainId),
    [],
  );
  return (
    <>
      <div className="grid grid-cols-12 gap-2">
        <div className="col-span-12">
          <BalancesCard
            chain={TELEPORTER_CONFIG.tlpMintChain}
            isBigLayout
          />
        </div>
        {nonMintingChains.map((chain) => (
          <div className="col-span-12 sm:col-span-6">
            <BalancesCard chain={chain} />
          </div>
        ))}
      </div>
      <div className="mt-4">
        <LoadingButton
          variant={isConnected && hasGas ? 'primary-gradient' : 'secondary'}
          className="w-full"
          isLoading={isSubmitting}
          onClick={handleMint}
          disabled={!isConnected || !hasGas || isSubmitting}
        >
          MINT
        </LoadingButton>
        <AutoAnimate>
          {!isConnected ? (
            <NotConnectedCard
              actionLabel="mint"
              className="mt-4"
            />
          ) : !hasGas ? (
            <OutOfGasCard
              chain={TELEPORTER_CONFIG.tlpMintChain}
              className="mt-4"
            />
          ) : null}
        </AutoAnimate>
        <AutoAnimate>
          {!!mintTxHash && (
            <TransactionSuccessAlert
              explorerBaseUrl={TELEPORTER_CONFIG.tlpMintChain.explorerUrl}
              txHash={mintTxHash}
              className="mt-4"
            >
              <Link
                to="/"
                className={cn(buttonVariants({ variant: 'default' }), 'w-full mt-4')}
              >
                <ArrowLeft
                  size={16}
                  className="mr-1"
                />
                Go to Bridge
              </Link>
            </TransactionSuccessAlert>
          )}
        </AutoAnimate>
      </div>
    </>
  );
});
