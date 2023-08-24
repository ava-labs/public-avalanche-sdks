import { ChainVm, type EvmChain } from '../types/chain';

export const ETHEREUM_INFO = {
  vmType: ChainVm.EthereumVM,
  evmChainId: '1',
  confirmationThreshold: 96,
  rpcUrl: 'https://mainnet.infura.io/v3/3d8a7c0b1b5a4b0e8b0b3b0f2b0b0b0b',
} as const satisfies EvmChain;
