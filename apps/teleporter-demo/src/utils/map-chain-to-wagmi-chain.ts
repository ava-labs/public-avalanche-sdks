import type { EvmTeleporterChain } from '@/constants/chains';

export const mapChainToWagmiChain = <T extends EvmTeleporterChain>(chain: T) => ({
  id: Number(chain.chainId),
  name: chain.name,
  nativeCurrency: {
    name: chain.networkToken.name,
    symbol: chain.networkToken.symbol,
    decimals: chain.networkToken.decimals,
  },
  rpcUrls: {
    default: {
      http: [chain.rpcUrl],
    },
    public: {
      http: [chain.rpcUrl],
    },
  },
  blockExplorers: {
    default: {
      name: 'Avalanche Subnet Explorer',
      url: chain.explorerUrl,
    },
  },
  testnet: chain.isTestnet,
});
