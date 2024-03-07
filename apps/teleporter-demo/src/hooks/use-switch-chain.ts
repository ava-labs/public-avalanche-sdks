import { useSwitchChain as useWagmiSwitchChain, useWalletClient } from 'wagmi';
import { useConnectedChain } from './use-connected-chain';
import { toast } from '@/ui/hooks/use-toast';
import { useState } from 'react';
import type { EvmTeleporterChain } from '@/constants/chains';

const USER_REJECTS_APPROVAL_POPUP_CODE = 4001;
// const CHAIN_NOT_ADDED_CODE = 4902;

export const useSwitchChain = () => {
  const { connectedChain } = useConnectedChain();
  const [dismissToast, setDismissToast] = useState<() => unknown>();
  const { data: walletClient } = useWalletClient();

  const { switchChainAsync: wagmiSwitchChainAsync, ...rest } = useWagmiSwitchChain({
    mutation: {
      onSuccess: ({ name }) => {
        dismissToast?.();
        const { dismiss } = toast({
          title: 'Success',
          description: `Connected to ${name}.`,
        });
        setDismissToast(dismiss);
      },
      onMutate: ({ chainId }) => {
        dismissToast?.();
        const { dismiss } = toast({
          title: 'Switching Networks',
          description: `Switching to ${chainId}.`,
        });
        setDismissToast(dismiss);
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onError: async (error: any) => {
        dismissToast?.();
        if (error?.code === USER_REJECTS_APPROVAL_POPUP_CODE) {
          const { dismiss } = toast({
            title: 'User rejected network switch.',
          });
          setDismissToast(dismiss);
          return;
        }

        const { dismiss } = toast({
          title: 'Unable to Switch Networks',
          description: `Please try again.`,
          variant: 'destructive',
        });
        setDismissToast(dismiss);
      },
    },
  });

  return {
    switchChainAsync: async (chain: EvmTeleporterChain) => {
      if (!walletClient) {
        throw new Error('Wallet client not found');
      }
      // If we're already connected to the chain, don't switch.
      if (connectedChain?.chainId === chain.chainId) {
        return;
      }

      const chainSwitchRes = await wagmiSwitchChainAsync({
        chainId: Number(chain.chainId),
      });

      return chainSwitchRes;
    },
    ...rest,
  };
};
