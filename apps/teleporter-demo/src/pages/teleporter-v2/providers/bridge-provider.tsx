import { type PropsWithChildren, createContext, memo, useMemo, useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';

import { TELEPORTER_CONFIG, type EvmTeleporterChain } from '@/constants/chains';
import { useContextStrict } from '@/hooks/use-context-strict';
import { z } from 'zod';
import { useForm, type UseFormReturn } from 'react-hook-form';
import { useErc20Balance } from '@/hooks/use-erc20-balance';
import { useAccount, useBalance } from 'wagmi';
import { useTeleport, type TeleporterStatus } from '@/hooks/use-teleport';
import type { TransactionReceipt } from 'viem';
import Big from 'big.js';
import { useSwitchChain } from '@/hooks/use-switch-chain';

const formSchema = z.object({
  fromChainId: z.enum(TELEPORTER_CONFIG.chainIds),
  toChainId: z.enum(TELEPORTER_CONFIG.chainIds),
  erc20Amount: z.number(),
});
export type BridgeFormValues = z.infer<typeof formSchema>;

const BridgeContext = createContext<
  | {
      fromChain: EvmTeleporterChain;
      toChain: EvmTeleporterChain;
      setChainValue: (fieldName: 'fromChainId' | 'toChainId', newChain: EvmTeleporterChain) => void;
      maxErc20Amount: string;
      form: UseFormReturn<z.infer<typeof formSchema>>;
      handleBridgeToken: (data: z.infer<typeof formSchema>) => Promise<void>;
      transactionReceipt?: TransactionReceipt;
      teleporterStatus: TeleporterStatus;
      reset: () => void;
      activeDrag: {
        activeDragChain: EvmTeleporterChain | undefined;
        setActiveDragChain: (chain: EvmTeleporterChain | undefined) => void;
        fromChain: EvmTeleporterChain | undefined;
        setFromChain: (chain: EvmTeleporterChain | undefined) => void;
        toChain: EvmTeleporterChain | undefined;
        setToChain: (chain: EvmTeleporterChain | undefined) => void;
      };
    }
  | undefined
>(undefined);
BridgeContext.displayName = 'BridgeContext';

const getChain = (chainId: (typeof TELEPORTER_CONFIG.chains)[number]['chainId']) => {
  const chain = TELEPORTER_CONFIG.chains.find((chain) => chain.chainId === chainId);
  if (!chain) {
    throw new Error(`Invalid chain ID: ${chainId}`);
  }
  return chain;
};

export const BridgeProvider = memo(function AuthProvider({ children }: PropsWithChildren) {
  const [maxErc20Amount, setMaxErc20Amount] = useState<string>('0');
  // Modify with min/max for erc20Amount
  const extendedFormSchema = formSchema.extend({
    erc20Amount: z.number().max(Number(maxErc20Amount)).positive(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(extendedFormSchema),
    defaultValues: {
      erc20Amount: 1,
      fromChainId: TELEPORTER_CONFIG.chains[0].chainId,
      toChainId: TELEPORTER_CONFIG.chains[1].chainId,
    },
  });

  const fromChainId = form.watch('fromChainId');
  const toChainId = form.watch('toChainId');
  const fromChain = useMemo(() => getChain(fromChainId), [fromChainId]);
  const toChain = useMemo(() => getChain(toChainId), [toChainId]);

  const setFromChain = (newChain: EvmTeleporterChain) => {
    // Swap toChain if it is the same as the new fromChain
    if (toChain && newChain.chainId === toChain.chainId) {
      form.setValue('toChainId', fromChain.chainId);
    }
    form.setValue('fromChainId', newChain.chainId);
  };
  const setToChain = (newChain: EvmTeleporterChain) => {
    // Swap fromChain if it is the same as the new toChain
    if (fromChain && newChain.chainId === fromChain.chainId) {
      form.setValue('fromChainId', toChain.chainId);
    }
    form.setValue('toChainId', newChain.chainId);
  };
  const setChainValue = (fieldName: 'fromChainId' | 'toChainId', newChain: EvmTeleporterChain) => {
    fieldName === 'fromChainId' && setFromChain(newChain);
    fieldName === 'toChainId' && setToChain(newChain);
  };

  /**
   * ERC-20 Balances
   */
  const { formattedErc20Balance, refetch: refetchFromChainErc20Balance } = useErc20Balance({ chain: fromChain });
  useEffect(() => setMaxErc20Amount(formattedErc20Balance ?? '0'), [formattedErc20Balance]);
  const { refetch: refetchToChainErc20Balance } = useErc20Balance({ chain: toChain });

  /**
   * Gas Balance
   */
  const { address } = useAccount();
  const { refetch: refetchFromChainGasBalance } = useBalance({
    address,
    chainId: Number(fromChain.chainId),
  });

  /**
   * The active drag state is used to track the chain that is being dragged and the chain that it is being dragged over.
   */
  const [activeDragChain, setActiveDragChain] = useState<EvmTeleporterChain | undefined>();
  // The pending from and to chains that will be committed when the drag is dropped.
  const [activeDragFromChain, setActiveDragFromChain] = useState<EvmTeleporterChain | undefined>();
  const [activeDragToChain, setActiveDragToChain] = useState<EvmTeleporterChain | undefined>();

  /**
   * Handle Bridging ERC-20 Tokens
   */
  const erc20Amount = Number(form.watch('erc20Amount'));
  const { switchChainAsync } = useSwitchChain();
  const { teleportToken, transactionReceipt, teleporterStatus, resetTeleportStatus } = useTeleport({
    fromChain,
    toChain,
    amount: useMemo(
      () => BigInt(new Big(erc20Amount).mul(10 ** fromChain.contracts.teleportedErc20.decimals).toFixed(0)),
      [erc20Amount],
    ),
  });

  const handleBridgeToken = async (_data: z.infer<typeof formSchema>) => {
    console.log('switching chain');

    await switchChainAsync(fromChain);
    // await switchChainAsync({
    //   chainId: Number(fromChain.chainId),
    // });
    console.log('switched chain');
    console.log('teleporting');

    await teleportToken();
    console.log('teleported');
    refetchFromChainErc20Balance();
    refetchFromChainGasBalance();

    // There currently isn't any way to detect transaction confirmation on the toChain,
    // so just refetch balances after a short delay.
    setTimeout(() => {
      refetchToChainErc20Balance();
    }, 5000);
  };

  const reset = () => {
    form.reset();
    resetTeleportStatus();
  };

  return (
    <BridgeContext.Provider
      value={{
        fromChain,
        setChainValue,
        toChain,
        form,
        maxErc20Amount,
        teleporterStatus,
        reset,
        handleBridgeToken,
        transactionReceipt,
        activeDrag: {
          activeDragChain,
          setActiveDragChain,
          fromChain: activeDragFromChain,
          setFromChain: setActiveDragFromChain,
          toChain: activeDragToChain,
          setToChain: setActiveDragToChain,
        },
      }}
    >
      {children}
    </BridgeContext.Provider>
  );
});

export const useBridgeContext = () => {
  const context = useContextStrict(BridgeContext);
  if (!context) {
    throw new Error('useBridgeContext must be used within a BridgeProvider');
  }
  return context;
};
