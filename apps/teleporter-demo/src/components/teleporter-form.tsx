import { AMPLIFY_CHAIN, BULLETIN_CHAIN, CHAINS } from '@/constants/chains';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/ui/select';
import { type UseFormReturn } from 'react-hook-form';

import { z } from 'zod';
import { FancyAvatar } from './fancy-avatar';
import { memo, useEffect, useMemo, useState } from 'react';
import { LoadingButton } from './loading-button';

import { useAccount, useBalance } from 'wagmi';
import { Card, CardContent } from '@/ui/card';
import { ConnectWalletButton } from './connect-wallet-button';

import type { EvmChain } from '@/types/chain';
import { Input } from '@/ui/input';
import { sleep } from '@/utils/sleep';
import { AutoAnimate } from '@/ui/auto-animate';
import { useErc20Balance } from '@/hooks/use-erc20-balance';
import { Skeleton } from '@/ui/skeleton';
import { isNil } from 'lodash-es';
import { formatStringNumber } from '@/utils/format-string';
import { MIN_AMOUNT_FOR_GAS } from '@/constants/token';
import { buttonVariants } from '@/ui/button';
import { ExternalLink } from 'lucide-react';
import { cn } from '@/utils/cn';
import { parseNumberInput } from '@/utils/parse-number-input';

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
  const [amount, setAmount] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toChainsList = useMemo(() => CHAINS.filter((chain) => chain.chainId !== fromChain.chainId), [fromChain]);

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
  console.log('erc20Balance', erc20Balance);
  console.log('formattedErc20Balance', formattedErc20Balance);

  useEffect(() => {
    if (fromChain.chainId === toChain.chainId) {
      const nextToChain = toChainsList[0];
      if (!nextToChain) {
        throw new Error('Invalid toChainList');
      }

      setToChain(nextToChain);
    }
  }, [fromChain, toChainsList]);

  const handleTeleport = async () => {
    setIsSubmitting(true);
    await sleep(1000);
    setIsSubmitting(false);
  };

  const hasGas = !isNil(gasBalance) && gasBalance.value > MIN_AMOUNT_FOR_GAS;

  return (
    <>
      <Card className="border-0 bg-neutral-900 rounded-b-none">
        <CardContent>
          <div className="grid grid-cols-12 gap-y-4 gap-x-4">
            <p className="font-semibold text-md col-span-6">From</p>
            <Select
              onValueChange={(chainId) => setFromChain(findChain(chainId))}
              value={fromChain.chainId}
              disabled={isSubmitting}
            >
              <SelectTrigger className="col-span-6 border-neutral-700">
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
              <p>
                Balance:{' '}
                {isLoadingErc20Balance ? (
                  <Skeleton className="w-6 h-2 inline-flex" />
                ) : isNil(formattedErc20Balance) ? (
                  'N/A'
                ) : (
                  formatStringNumber(formattedErc20Balance)
                )}{' '}
              </p>
            </div>
            <div className="flex flex-col justify-center col-span-6">
              <p className="font-semibold text-md text-right">{fromChain.utilityContracts.demoErc20.symbol}</p>
            </div>
            <div className="col-span-6">
              <Input
                placeholder="0.0"
                value={amount}
                onChange={(e) => setAmount(parseNumberInput(e.target.value))}
              />
            </div>
          </div>
        </CardContent>
      </Card>
      <Card className="border-0 bg-neutral-800 rounded-t-none">
        <CardContent>
          <div className="grid grid-cols-12 gap-y-4 gap-x-4">
            <p className="font-semibold text-md col-span-6">To</p>
            <Select
              onValueChange={(chainId) => setToChain(findChain(chainId))}
              value={toChain.chainId}
              disabled={isSubmitting}
            >
              <SelectTrigger className="col-span-6 border-neutral-600">
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
          variant={isConnected && hasGas ? 'default' : 'secondary'}
          className="w-full"
          onClick={handleTeleport}
          isLoading={isSubmitting}
          disabled={!isConnected || !hasGas}
        >
          TELEPORT
        </LoadingButton>
        <AutoAnimate>
          {!isConnected ? (
            <Card className="mt-4">
              <CardContent className="flex flex-col gap-1">
                <p className="text-sm text-neutral-400 text-center">Must connect wallet to teleport</p>
                <ConnectWalletButton
                  variant="default"
                  className="mt-1"
                />
              </CardContent>
            </Card>
          ) : !hasGas ? (
            <Card className="mt-4">
              <CardContent className="flex flex-col gap-1">
                <p className="text-sm text-neutral-400 text-center">
                  Out of gas! Go to the faucet to mint some {fromChain.networkToken.symbol}.
                </p>
                <a
                  className={cn(buttonVariants({ variant: 'default' }), 'mt-1')}
                  href={fromChain.faucetUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Go to Faucet
                  <ExternalLink
                    size={16}
                    className="ml-1"
                  />
                </a>
              </CardContent>
            </Card>
          ) : null}
        </AutoAnimate>
      </div>
    </>
  );
});
