import type { EvmTeleporterChain } from '@/constants/chains';
import { useSuspenseQuery } from '@tanstack/react-query';
import Big from 'big.js';
import { useMemo } from 'react';
import { useAccount, useConfig } from 'wagmi';
import { readContractQueryOptions } from 'wagmi/query';

export const useErc20Balance = ({ chain }: { chain: EvmTeleporterChain }) => {
  const { address } = useAccount();
  const config = useConfig();
  const { data: erc20Balance, ...rest } = useSuspenseQuery(
    readContractQueryOptions(config, {
      abi: chain.contracts.teleportedErc20.abi,
      functionName: 'balanceOf',
      address: chain.contracts.teleportedErc20.address,
      args: address ? [address] : undefined,
      chainId: chain ? Number(chain.chainId) : undefined,
    }),
  );

  const formattedErc20Balance = useMemo(() => {
    return new Big(erc20Balance.toString()).div(10 ** chain.contracts.teleportedErc20.decimals).toString();
  }, [erc20Balance]);

  return {
    erc20Balance,
    formattedErc20Balance,
    ...rest,
  };
};
