import type { EvmChain } from '@/types/chain';
import type { Chain } from 'wagmi';

export const AMPLIFY_CHAIN = {
  chainId: '78430',
  name: 'Amplify Subnet',
  networkToken: {
    decimals: 18,
    name: 'AMP',
    symbol: 'AMP',
  },
  slug: 'amplify',
  explorerUrl: 'https://subnets-test.avax.network/amplify',
  rpcUrl: 'https://subnets.avax.network/amplify/testnet/rpc',
  isTestnet: true,
  logoUrl:
    'https://images.ctfassets.net/gcj8jwzm6086/5fZAVhKA9gMyf6p5pRt0pV/bc1f2b3e2f4e7413602f6b868df81546/Screenshot_2023-07-27_at_10.17.25_AM_-_Cameron_Schultz.png?h=250',
  primaryColor: '#FF7C43',
} as const satisfies EvmChain;

export const BULLETIN_CHAIN = {
  chainId: '78431',
  name: 'Bulletin Subnet',
  networkToken: {
    decimals: 18,
    name: 'BLT',
    symbol: 'BLT',
  },
  slug: 'bulletin',
  explorerUrl: 'https://subnets-test.avax.network/bulletin',
  rpcUrl: 'https://subnets.avax.network/bulletin/testnet/rpc',
  isTestnet: true,
  logoUrl:
    'https://images.ctfassets.net/gcj8jwzm6086/5B7Vfj3t6r3ZqlEyyAaKRI/da8ec29ddfdf7eaacd3298c01f9c798e/Screenshot_2023-07-27_at_10.17.35_AM_-_Cameron_Schultz.png?h=250',
  primaryColor: '#A05195',
} as const satisfies EvmChain;

export const CONDUIT_CHAIN = {
  chainId: '43114',
  // TODO: remember to flip this back.
  // chainId: '78432',
  name: 'Conduit Subnet',
  networkToken: {
    decimals: 18,
    name: 'CON',
    symbol: 'CON',
  },
  slug: 'conduit',
  explorerUrl: 'https://subnets-test.avax.network/conduit',
  rpcUrl: 'https://subnets.avax.network/conduit/testnet/rpc',
  isTestnet: true,
  logoUrl:
    'https://images.ctfassets.net/gcj8jwzm6086/IeLUEqVDIv4npUjEIOkSB/7d37730f211ff6449a29103c5f22b463/Screenshot_2023-07-27_at_10.17.43_AM_-_Cameron_Schultz.png?h=250',
  primaryColor: '#00C2B4',
} as const satisfies EvmChain;

const mapChainToWagmiChain = (chain: EvmChain): Chain => ({
  id: Number(chain.chainId),
  name: chain.name,
  nativeCurrency: {
    name: chain.networkToken.name,
    symbol: chain.networkToken.symbol,
    decimals: chain.networkToken.decimals,
  },
  network: 'avalanche',
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

export const CHAIN = {
  AMPLIFY: {
    info: AMPLIFY_CHAIN,
    wagmi: mapChainToWagmiChain(AMPLIFY_CHAIN),
  },
  BULLETIN: {
    info: BULLETIN_CHAIN,
    wagmi: mapChainToWagmiChain(BULLETIN_CHAIN),
  },
  CONDUIT: {
    info: CONDUIT_CHAIN,
    wagmi: mapChainToWagmiChain(CONDUIT_CHAIN),
  },
} as const satisfies Record<
  string,
  {
    info: EvmChain;
    wagmi: Chain;
  }
>;

export const CHAINS = Object.values(CHAIN).map(({ info }) => info);
export const WAGMI_CHAINS = Object.values(CHAIN).map(({ wagmi }) => wagmi);
