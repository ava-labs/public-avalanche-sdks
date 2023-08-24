import type { Address } from 'viem';

export enum TokenType {
  NATIVE = 'native',
  ERC20 = 'erc20',
}

export type NativeToken = {
  type: `${TokenType.NATIVE}`;
  name: string;
  symbol: string;
  decimals: number;
};

export type Erc20Token = {
  type: `${TokenType.ERC20}`;
  address: Address;
  name: string;
  symbol: string;
  decimals: number;
};

export type Token = NativeToken | Erc20Token;
