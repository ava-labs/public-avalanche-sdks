import type { EvmChain } from '@/types/chain';
import { useSwitchNetwork } from 'wagmi';
import { useConnectedChain } from './use-connected-chain';
import { toast } from '@/ui/hooks/use-toast';
import { useState } from 'react';
import { CHAINS } from '@/constants/chains';

const USER_REJECTS_APPROVAL_POPUP_CODE = 4001;
const CHAIN_NOT_ADDED_CODE = 4902;

export const useSwitchChain = () => {
  const { connectedChain } = useConnectedChain();
  const [dismissToast, setDismissToast] = useState<() => unknown>();

  const { switchNetworkAsync } = useSwitchNetwork({
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
    onSettled: (test) => {
      console.log('settled', test);
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: async (error: any, { chainId }) => {
      dismissToast?.();
      if (error?.code === USER_REJECTS_APPROVAL_POPUP_CODE) {
        const { dismiss } = toast({
          title: 'User rejected network switch.',
        });
        setDismissToast(dismiss);
        return;
      }

      if (error?.code === CHAIN_NOT_ADDED_CODE) {
        const chain = CHAINS.find((chain) => chain.chainId === String(chainId));
        if (chain) {
          await window.ethereum?.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId,
                chainName: chain.name,
                rpcUrls: [chain.rpcUrl],
              },
            ],
          });
          const { dismiss } = toast({
            title: 'Chain added.',
          });
          setDismissToast(dismiss);
          return;
        }
      }

      const { dismiss } = toast({
        title: 'Unable to Switch Networks',
        description: `Please try again.`,
      });
      setDismissToast(dismiss);
    },
  });

  return {
    switchChain: async (chain: EvmChain) => {
      // If we're already connected to the chain, don't switch.
      if (!switchNetworkAsync || connectedChain?.chainId === chain.chainId) {
        return;
      }

      const chainSwitchRes = await switchNetworkAsync(Number(chain.chainId));

      if (String(chainSwitchRes.id) !== chain.chainId) {
        throw new Error(`Can only mint on ${chain.name}.`);
      }

      return chainSwitchRes;
    },
  };
};
