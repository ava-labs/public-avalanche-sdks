import { TELEPORTER_CONFIG } from '@/constants/chains';
import { useMemo } from 'react';
import { useAccount } from 'wagmi';

export const useConnectedChain = () => {
  const { chain: wagmiConnectedChain } = useAccount();

  return {
    connectedChain: useMemo(() => {
      return TELEPORTER_CONFIG.chains.find(
        (chain) => wagmiConnectedChain && chain.chainId === String(wagmiConnectedChain.id),
      );
    }, [wagmiConnectedChain]),
  };
};
