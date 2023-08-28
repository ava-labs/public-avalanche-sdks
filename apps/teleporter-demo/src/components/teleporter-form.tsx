import { AMPLIFY_CHAIN, BULLETIN_CHAIN, CHAINS } from '@/constants/chains';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/ui/select';
import { type UseFormReturn } from 'react-hook-form';

import { z } from 'zod';
import { FancyAvatar } from './fancy-avatar';
import { memo, useEffect, useMemo, useState } from 'react';
import { LoadingButton } from './loading-button';

import { useAccount, useBalance } from 'wagmi';
import { Card, CardContent } from '@/ui/card';

import type { EvmChain } from '@/types/chain';
import { Input } from '@/ui/input';
import { AutoAnimate } from '@/ui/auto-animate';
import { useErc20Balance } from '@/hooks/use-erc20-balance';
import { Skeleton } from '@/ui/skeleton';
import { isNil } from 'lodash-es';
import { formatStringNumber } from '@/utils/format-string';
import { MIN_AMOUNT_FOR_GAS } from '@/constants/token';
import { parseNumberInput } from '@/utils/parse-number-input';
import { useTeleport } from '@/hooks/use-teleport';
import Big from 'big.js';
import { NotConnectedCard } from './not-connected-card';
import { OutOfGasCard } from './out-of-gas-card';
import { toast } from '@/ui/hooks/use-toast';
import { TransactionSuccessAlert } from './transaction-success-alert';

const formSchema = z.object({
  fromChain: z.string(),
  toChain: z.string(),
  tokenUniversalId: z.string(),
  amount: z.string(),
});

export type TeleportForm = UseFormReturn<
  z.infer<typeof formSchema>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  any,
  undefined
>;

const findChain = (chainId: string) => {
  const chain = CHAINS.find((chain) => chain.chainId === chainId);
  if (!chain) {
    throw new Error('Invalid selected chain');
  }
  return chain;
};

export const TeleporterForm = memo(() => {
  /**
   * Form state
   */
  const [fromChain, setFromChain] = useState<EvmChain>(AMPLIFY_CHAIN);
  const [toChain, setToChain] = useState<EvmChain>(BULLETIN_CHAIN);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toChainsList = useMemo(() => CHAINS.filter((chain) => chain.chainId !== fromChain.chainId), [fromChain]);
  const [amount, setAmount] = useState('');
  const amountBigInt = useMemo(() => {
    try {
      return BigInt(new Big(amount).mul(10 ** fromChain.utilityContracts.demoErc20.decimals).toString());
    } catch {
      return undefined;
    }
  }, [amount]);
  const [teleportTxHash, setTeleportTxHash] = useState<string>();

  /**
   * Wallet state
   */
  const { address, isConnected } = useAccount();
  const { data: gasBalance } = useBalance({
    address,
    chainId: Number(fromChain.chainId),
  });

  const {
    erc20Balance,
    formattedErc20Balance,
    isLoading: isLoadingErc20Balance,
  } = useErc20Balance({
    chain: fromChain,
    tokenAddress: fromChain.utilityContracts.demoErc20.address,
    decimals: fromChain.utilityContracts.demoErc20.decimals,
  });

  useEffect(() => {
    if (fromChain.chainId === toChain.chainId) {
      const nextToChain = toChainsList[0];
      if (!nextToChain) {
        throw new Error('Invalid toChainList');
      }

      setToChain(nextToChain);
    }
  }, [fromChain, toChainsList]);

  const { teleportToken } = useTeleport({
    amount: amountBigInt,
    fromChain,
    toChain,
  });

  const handleTeleport = async () => {
    setIsSubmitting(true);
    setTeleportTxHash(undefined);
    const res = await teleportToken();
    setIsSubmitting(false);
    if (!res) {
      toast({
        title: 'Teleport failed',
        description: 'Please try again',
        variant: 'destructive',
      });
      return;
    }

    setTeleportTxHash(res.hash);

    toast({
      title: 'Teleport success!',
      description: 'View your transaction on the explorer',
    });
  };

  const hasGas = !isNil(gasBalance) ? gasBalance.value > MIN_AMOUNT_FOR_GAS : true;
  const hasSufficientErc20Balance = !isNil(erc20Balance) && !isNil(amountBigInt) ? erc20Balance > amountBigInt : true;

  return (
    <>
      <Card className="border-0 bg-neutral-900 rounded-b-none">
        <CardContent>
          <div className="grid grid-cols-12 gap-y-4 gap-x-4">
            <p className="font-semibold text-md col-span-3 sm:col-span-6">From</p>
            <Select
              onValueChange={(chainId) => setFromChain(findChain(chainId))}
              value={fromChain.chainId}
              disabled={isSubmitting}
            >
              <SelectTrigger className="col-span-9 sm:col-span-6 border-neutral-700">
                <SelectValue placeholder="Select a subnet" />
              </SelectTrigger>
              <SelectContent>
                {CHAINS.map((chain) => (
                  <SelectItem
                    value={chain.chainId}
                    key={chain.chainId}
                  >
                    <div className="flex items-center space-x-2 flex-nowrap p-1">
                      <FancyAvatar
                        src={chain.logoUrl}
                        label={chain.name}
                        className="w-6 h-6"
                      />
                      <p>{chain.name}</p>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="col-span-12 text-sm text-right text-gray-400">
              <div>
                Balance:{' '}
                {isLoadingErc20Balance ? (
                  <Skeleton className="w-6 h-2 inline-flex" />
                ) : isNil(formattedErc20Balance) ? (
                  'N/A'
                ) : (
                  formatStringNumber(formattedErc20Balance)
                )}{' '}
              </div>
            </div>
            <div className="flex flex-col justify-center col-span-3 sm:col-span-6">
              <p className="font-semibold text-md text-right">{fromChain.utilityContracts.demoErc20.symbol}</p>
            </div>
            <div className="col-span-9 sm:col-span-6">
              <Input
                placeholder="0.0"
                value={amount}
                onChange={(e) => setAmount(parseNumberInput(e.target.value))}
                disabled={isSubmitting}
              />
            </div>
          </div>
        </CardContent>
      </Card>
      <Card className="border-0 bg-neutral-800 rounded-t-none">
        <CardContent>
          <div className="grid grid-cols-12 gap-y-4 gap-x-4">
            <p className="font-semibold text-md col-span-3 sm:col-span-6">To</p>
            <Select
              onValueChange={(chainId) => setToChain(findChain(chainId))}
              value={toChain.chainId}
              disabled={isSubmitting}
            >
              <SelectTrigger className="col-span-9 sm:col-span-6 border-neutral-600">
                <SelectValue placeholder="Select a subnet" />
              </SelectTrigger>
              <SelectContent>
                {toChainsList.map((chain) => (
                  <SelectItem
                    value={chain.chainId}
                    key={chain.chainId}
                  >
                    <div className="flex items-center space-x-2 flex-nowrap p-1">
                      <FancyAvatar
                        src={chain.logoUrl}
                        label={chain.name}
                        className="w-6 h-6"
                      />
                      <p>{chain.name}</p>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="mt-4">
        <LoadingButton
          variant={isConnected && hasGas && amount && hasSufficientErc20Balance ? 'primary-gradient' : 'secondary'}
          className="w-full"
          onClick={handleTeleport}
          isLoading={isSubmitting}
          disabled={!isConnected || !hasGas || isSubmitting || !amount || !hasSufficientErc20Balance}
          loadingText="Teleporting..."
          tooltipContent={
            !isConnected
              ? 'Please connect your wallet.'
              : !hasGas
              ? 'Insufficient gas balance.'
              : !amount
              ? 'Please enter an amount.'
              : !hasSufficientErc20Balance
              ? 'Insufficient balance. Please enter a lower amount.'
              : undefined
          }
        >
          TELEPORT
        </LoadingButton>
        <AutoAnimate>
          {!isConnected ? (
            <NotConnectedCard
              actionLabel="teleport"
              className="mt-4"
            />
          ) : !hasGas ? (
            <OutOfGasCard
              chain={fromChain}
              className="mt-4"
            />
          ) : null}
        </AutoAnimate>
        <AutoAnimate>
          {!!teleportTxHash && (
            <TransactionSuccessAlert
              explorerBaseUrl={fromChain.explorerUrl}
              txHash={teleportTxHash}
              className="mt-4"
            />
          )}
        </AutoAnimate>
      </div>
    </>
  );
});
