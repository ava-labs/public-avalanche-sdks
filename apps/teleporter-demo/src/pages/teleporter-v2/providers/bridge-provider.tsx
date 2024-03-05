import { type PropsWithChildren, createContext, memo, useMemo, useCallback, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';

import { TELEPORTER_CONFIG, type EvmTeleporterChain } from '@/constants/chains';
import { useContextStrict } from '@/hooks/use-context-strict';
import { z } from 'zod';
import { useForm, type UseFormReturn } from 'react-hook-form';

const formSchema = z.object({
  fromChainId: z.enum(TELEPORTER_CONFIG.chainIds),
  toChainId: z.enum(TELEPORTER_CONFIG.chainIds),
  erc20Amount: z.number(),
});

const BridgeContext = createContext<
  | {
      fromChain: EvmTeleporterChain;
      toChain: EvmTeleporterChain;
      setFromChain: (chain: EvmTeleporterChain) => void;
      setToChain: (chain: EvmTeleporterChain) => void;
      erc20Amount?: string;
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
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
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
  const setChain = useCallback(
    (
      newChain: EvmTeleporterChain,
      {
        prevChain,
        prevOtherChain,
        chainSetter,
        otherChainSetter,
      }: {
        prevChain: EvmTeleporterChain;
        prevOtherChain: EvmTeleporterChain;
        chainSetter: (chain: EvmTeleporterChain) => void;
        otherChainSetter: (chain: EvmTeleporterChain) => void;
      },
    ) => {
      chainSetter(newChain);
      if (prevChain && newChain === prevOtherChain) {
        otherChainSetter(prevChain);
      }
    },
    [toChain, fromChain],
  );

  const setToChain = useCallback(
    (newChain: EvmTeleporterChain) => {
      setChain(newChain, {
        chainSetter: (chain) => chain && form.setValue('toChainId', chain.chainId),
        otherChainSetter: (chain) => chain && form.setValue('fromChainId', chain.chainId),
        prevChain: toChain,
        prevOtherChain: fromChain,
      });
    },
    [form.setValue, toChain, fromChain, setChain],
  );

  const setFromChain = useCallback(
    (newChain: EvmTeleporterChain) => {
      setChain(newChain, {
        chainSetter: (chain) => chain && form.setValue('fromChainId', chain.chainId),
        otherChainSetter: (chain) => chain && form.setValue('toChainId', chain.chainId),
        prevChain: fromChain,
        prevOtherChain: toChain,
      });
    },
    [form.setValue, toChain, fromChain, setChain],
  );

  const [activeDragChain, setActiveDragChain] = useState<EvmTeleporterChain | undefined>();
  const [activeDragFromChain, setActiveDragFromChain] = useState<EvmTeleporterChain | undefined>();
  const [activeDragToChain, setActiveDragToChain] = useState<EvmTeleporterChain | undefined>();

  const handleSetActiveDragFromChain = useCallback(
    (newChain?: EvmTeleporterChain) => {
      setActiveDragFromChain(newChain);
    },
    [form.setValue, toChain, fromChain, setChain],
  );
  const handleSetActiveDragToChain = useCallback(
    (newChain?: EvmTeleporterChain) => {
      setActiveDragToChain(newChain);
    },
    [form.setValue, toChain, fromChain, setChain],
  );

  return (
    <BridgeContext.Provider
      value={{
        fromChain,
        setFromChain,
        toChain,
        setToChain,
        form,
        erc20Amount: undefined,
        activeDrag: {
          activeDragChain,
          setActiveDragChain,
          fromChain: activeDragFromChain,
          setFromChain: handleSetActiveDragFromChain,
          toChain: activeDragToChain,
          setToChain: handleSetActiveDragToChain,
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
