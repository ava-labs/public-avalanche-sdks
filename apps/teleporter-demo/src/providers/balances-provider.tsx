import { createContext, memo, type PropsWithChildren, useContext, useMemo } from 'react';
import { useAccount } from 'wagmi';

import { GLACIER_EVM_MAX_PAGE_SIZE, glacierService } from '@/constants';
import { CHAINS } from '@/constants/chains';
import { getDisplayTokenBalance } from '@/utils/get-display-token-balance';
import { filterFullfilled } from '@/utils/is-fullfilled';
import useSWR, { type SWRResponse } from 'swr';
import { getUniveralTokenId, type Erc20TokenBalance, type NativeTokenBalance, type TokenBalance } from '@/utils/token';
import Big from 'big.js';

const getNativeBalances = async ([address]: [address: string]): Promise<NativeTokenBalance[]> => {
  const results = await Promise.allSettled(
    CHAINS.map((chain) => {
      return glacierService.evmBalances.getNativeBalance({
        address,
        chainId: chain.chainId,
      });
    }),
  );

  const flatNativeBalances = filterFullfilled(results).flatMap(({ nativeTokenBalance }) => {
    return nativeTokenBalance;
  });

  return flatNativeBalances.map((token) => {
    return {
      ...token,
      balance: new Big(token.balance).div(10 ** token.decimals),
      rawBalance: BigInt(token.balance),
      displayBalance: getDisplayTokenBalance(token),
      universalTokenId: getUniveralTokenId(token),
    };
  });
};

const getErc20Balances = async ([address]: [address: string]): Promise<Erc20TokenBalance[]> => {
  const results = await Promise.allSettled(
    CHAINS.map((chain) => {
      return glacierService.evmBalances.listErc20Balances({
        address,
        chainId: chain.chainId,
        pageSize: GLACIER_EVM_MAX_PAGE_SIZE,
      });
    }),
  );

  const flatErc20Balances = filterFullfilled(results).flatMap(({ erc20TokenBalances }) => {
    return erc20TokenBalances;
  });

  return flatErc20Balances.map((token) => {
    return {
      ...token,
      balance: new Big(token.balance).div(10 ** token.decimals),
      rawBalance: BigInt(token.balance),
      displayBalance: getDisplayTokenBalance(token),
      universalTokenId: getUniveralTokenId(token),
    };
  });
};

type BalancesContextValue = SWRResponse<TokenBalance[]> & {
  tokens?: TokenBalance[];
  tokensMap?: Map<string, TokenBalance>;
};

export const DEFAULT_APP_CHAINS_CONTEXT: BalancesContextValue = {} as BalancesContextValue;

const BalancesContext = createContext<BalancesContextValue>(DEFAULT_APP_CHAINS_CONTEXT);

/**
 * Get all native and erc20 balances for a given address on the teleporter-supported chains
 */
export const BalancesProvider = memo(function BalancesProvider({ children }: PropsWithChildren) {
  const { address } = useAccount();

  const swr = useSWR(address ? [address, 'useBalances'] : null, async ([address]): Promise<TokenBalance[]> => {
    const [nativeBalances, erc20Balances] = await Promise.all([
      getNativeBalances([address]),
      getErc20Balances([address]),
    ]);

    return [...nativeBalances, ...erc20Balances];
  });

  const tokens = swr.data;

  const tokensMap = useMemo(() => {
    const map = new Map<string, TokenBalance>();
    tokens?.forEach((token) => {
      map.set(getUniveralTokenId(token), token);
    });

    return map;
  }, [tokens]);

  return (
    <BalancesContext.Provider
      value={{
        ...swr,
        tokens,
        tokensMap,
      }}
    >
      {children}
    </BalancesContext.Provider>
  );
});

export const useBalances = () => useContext(BalancesContext);
