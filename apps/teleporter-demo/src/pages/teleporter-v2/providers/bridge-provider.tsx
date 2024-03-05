import { type PropsWithChildren, createContext, memo, useMemo, useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';

import { TELEPORTER_CONFIG, type EvmTeleporterChain } from '@/constants/chains';
import { useContextStrict } from '@/hooks/use-context-strict';
import { z } from 'zod';
import { useForm, type UseFormReturn } from 'react-hook-form';
import { useErc20Balance } from '@/hooks/use-erc20-balance';

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
    erc20Amount: z.number().min(0).max(Number(maxErc20Amount)),
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

  const { formattedErc20Balance } = useErc20Balance({ chain: fromChain });
  useEffect(() => setMaxErc20Amount(formattedErc20Balance ?? '0'), [formattedErc20Balance]);

  /**
   * The active drag state is used to track the chain that is being dragged and the chain that it is being dragged over.
   */
  const [activeDragChain, setActiveDragChain] = useState<EvmTeleporterChain | undefined>();
  // The pending from and to chains that will be committed when the drag is dropped.
  const [activeDragFromChain, setActiveDragFromChain] = useState<EvmTeleporterChain | undefined>();
  const [activeDragToChain, setActiveDragToChain] = useState<EvmTeleporterChain | undefined>();

  return (
    <BridgeContext.Provider
      value={{
        fromChain,
        setChainValue,
        toChain,
        form,
        maxErc20Amount,
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
