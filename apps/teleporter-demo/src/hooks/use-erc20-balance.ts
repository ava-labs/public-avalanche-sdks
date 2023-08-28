import { NATIVE_ERC20_ABI } from '@/constants/abis/native-erc-20';
import type { EvmChain } from '@/types/chain';
import Big from 'big.js';
import { isNil } from 'lodash-es';
import { useMemo } from 'react';
import { useContractRead, type Address, useAccount } from 'wagmi';

export const useErc20Balance = ({
  chain,
  tokenAddress,
  decimals,
}: {
  chain: EvmChain;
  tokenAddress: Address;
  decimals: number;
}) => {
  const { address } = useAccount();
  const { data: erc20Balance, ...rest } = useContractRead({
    abi: NATIVE_ERC20_ABI,
    functionName: 'balanceOf',
    address: tokenAddress,
    args: address ? [address] : undefined,
    chainId: Number(chain.chainId),
  });
  const formattedErc20Balance = useMemo(() => {
    if (isNil(erc20Balance)) {
      return undefined;
    }

    return new Big(erc20Balance.toString()).div(10 ** decimals).toString();
  }, [erc20Balance]);

  return {
    erc20Balance,
    formattedErc20Balance,
    ...rest,
  };
};
