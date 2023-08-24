export enum ChainVm {
  EthereumVM = 'EVM',
}

export type EvmChain = {
  vmType: ChainVm;
  evmChainId: string;
  rpcUrl: string;
  confirmationThreshold: number;
};
