import type { EvmChain } from '@/types/chain';
import { useSwitchNetwork } from 'wagmi';
import { useConnectedChain } from './use-connected-chain';
import { toast } from '@/ui/hooks/use-toast';
import { useState } from 'react';

const USER_REJECTS_APPROVAL_POPUP_CODE = 4001;
// const CHAIN_NOT_ADDED_CODE = 4902;

export const useSwitchChain = () => {
  const { connectedChain } = useConnectedChain();
  const [dismissToast, setDismissToast] = useState<() => unknown>();

  const { switchNetworkAsync } = useSwitchNetwork({
    throwForSwitchChainNotSupported: true,
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
  });

  const addChain = async (chain: EvmChain) => {
    try {
      const hexChainId = `0x${Number(chain.chainId).toString(16)}`;
      await window.ethereum?.request({
        method: 'wallet_addEthereumChain',
        params: [
          {
            chainId: hexChainId,
            chainName: chain.name,
            rpcUrls: [chain.rpcUrl],
            blockExplorerUrls: [chain.explorerUrl],
            iconUrls: [chain.logoUrl],
            nativeCurrency: {
              decimals: chain.networkToken.decimals,
              name: chain.networkToken.name,
              symbol: chain.networkToken.symbol,
            },
          },
        ],
      });

      return {
        chainId: chain.chainId,
      };
    } catch (error) {
      console.error(error);
      return;
    }
  };

  const switchOrAdd = async (chain: EvmChain) => {
    try {
      if (!switchNetworkAsync) {
        return;
      }
      const chainSwitchRes = await switchNetworkAsync(Number(chain.chainId));
      if (String(chainSwitchRes.id) !== chain.chainId) {
        throw new Error(`Can only mint on ${chain.name}.`);
      }
      return {
        chainId: String(chainSwitchRes.id),
      };
    } catch (e) {
      return await addChain(chain);
    }
  };

  return {
    switchChain: async (chain: EvmChain) => {
      // If we're already connected to the chain, don't switch.
      if (connectedChain?.chainId === chain.chainId) {
        return;
      }

      const chainSwitchRes = await switchOrAdd(chain);

      if (String(chainSwitchRes?.chainId) !== chain.chainId) {
        throw new Error(`Can only mint on ${chain.name}.`);
      }

      return chainSwitchRes;
    },
  };
};
