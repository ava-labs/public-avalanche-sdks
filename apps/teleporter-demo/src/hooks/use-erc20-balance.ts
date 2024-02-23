import type { EvmTeleporterChain } from '@/constants/chains';
import Big from 'big.js';
import { isNil } from 'lodash-es';
import { useMemo } from 'react';
import { useReadContract, useAccount } from 'wagmi';

export const useErc20Balance = ({ chain }: { chain: EvmTeleporterChain }) => {
  const { address } = useAccount();
  const { data: erc20Balance, ...rest } = useReadContract({
    abi: chain.contracts.teleportedErc20.abi,
    functionName: 'balanceOf',
    address: chain.contracts.teleportedErc20.address,
    args: address ? [address] : undefined,
    chainId: chain ? Number(chain.chainId) : undefined,
  });
  const formattedErc20Balance = useMemo(() => {
    if (isNil(chain) || isNil(erc20Balance)) {
      return undefined;
    }

    return new Big(erc20Balance.toString()).div(10 ** chain.contracts.teleportedErc20.decimals).toString();
  }, [erc20Balance]);

  return {
    erc20Balance,
    formattedErc20Balance,
    ...rest,
  };
};
