import {
  type Erc20TokenBalance as GlacierErc20TokenBalance,
  type NativeTokenBalance as GlacierNativeTokenBalance,
} from '@internal/glacier';

export type Erc20TokenBalance = GlacierErc20TokenBalance & {
  displayBalance: string;
  universalTokenId: string;
};

export type NativeTokenBalance = GlacierNativeTokenBalance & {
  displayBalance: string;
  universalTokenId: string;
};

export type TokenBalance = Erc20TokenBalance | NativeTokenBalance;

export const isErc20TokenBalance = (token: TokenBalance): token is Erc20TokenBalance => {
  return (token as Erc20TokenBalance).ercType === 'ERC-20';
};

export const isNativeTokenBalance = (token: TokenBalance): token is NativeTokenBalance => {
  return !isErc20TokenBalance(token);
};

export const getUniveralTokenId = (token: TokenBalance | GlacierErc20TokenBalance | GlacierNativeTokenBalance) => {
  if ('ercType' in token) {
    return `${token.chainId}-${token.address}`;
  }

  return `${token.chainId}-${token.symbol}`;
};
