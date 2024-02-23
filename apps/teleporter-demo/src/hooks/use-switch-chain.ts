import { useAccount, useSwitchChain as useWagmiSwitchChain, useWalletClient } from 'wagmi';
import { useConnectedChain } from './use-connected-chain';
import { toast } from '@/ui/hooks/use-toast';
import { useState } from 'react';
import { CORE_CONNECTOR_NAME } from '@/constants';
import { mapChainToWagmiChain } from '@/utils/map-chain-to-wagmi-chain';
import type { EvmTeleporterChain } from '@/constants/chains';

const USER_REJECTS_APPROVAL_POPUP_CODE = 4001;
// const CHAIN_NOT_ADDED_CODE = 4902;

export const useSwitchChain = () => {
  const { connector } = useAccount();

  const { connectedChain } = useConnectedChain();
  const [dismissToast, setDismissToast] = useState<() => unknown>();
  const { data: walletClient } = useWalletClient();

  const { switchChainAsync } = useWagmiSwitchChain({
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
        });
        setDismissToast(dismiss);
      },
    },
  });

  return {
    switchChain: async (chain: EvmTeleporterChain) => {
      // If we're already connected to the chain, don't switch.
      if (!walletClient || connectedChain?.chainId === chain.chainId) {
        return;
      }

      try {
        // Core already will have all the chains added.
        connector?.name !== CORE_CONNECTOR_NAME &&
          (await walletClient?.addChain({
            chain: mapChainToWagmiChain(chain),
          }));
      } catch (error) {
        // ignore
        console.error(error);
      }

      const chainSwitchRes = await switchChainAsync({
        chainId: Number(chain.chainId),
      });

      if (String(chainSwitchRes.id) !== chain.chainId) {
        throw new Error(`Can only mint on ${chain.name}.`);
      }
      if (String(chainSwitchRes?.id) !== chain.chainId) {
        throw new Error(`Can only mint on ${chain.name}.`);
      }
      return chainSwitchRes;
    },
  };
};
