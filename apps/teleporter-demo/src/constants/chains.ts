import type { Chain } from 'wagmi';

const AMPLIFY = {
  id: 78430,
  name: 'Amplify Subnet',
  nativeCurrency: {
    name: 'AMP',
    symbol: 'AMP',
    decimals: 18,
  },
  network: 'avalanche',
  rpcUrls: {
    default: {
      http: ['https://subnets.avax.network/amplify/testnet/rpc'],
    },
    public: {
      http: ['https://subnets.avax.network/bulletin/testnet/rpc'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Avalanche Subnet Explorer',
      url: 'https://subnets-test.avax.network/amplify',
    },
  },
  testnet: true,
} as const satisfies Chain;

const BULLETIN = {
  id: 78431,
  name: 'Bulletin Subnet',
  nativeCurrency: {
    name: 'BLT',
    symbol: 'BLT',
    decimals: 18,
  },
  network: 'avalanche',
  rpcUrls: {
    default: {
      http: ['https://subnets.avax.network/conduit/testnet/rpc'],
    },
    public: {
      http: ['https://subnets.avax.network/conduit/testnet/rpc'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Avalanche Subnet Explorer',
      url: 'https://subnets-test.avax.network/conduit',
    },
  },
  testnet: true,
} as const satisfies Chain;

const CONDUIT = {
  id: 78432,
  name: 'Conduit Subnet',
  nativeCurrency: {
    name: 'CON',
    symbol: 'CON',
    decimals: 18,
  },
  network: 'avalanche',
  rpcUrls: {
    default: {
      http: ['https://subnets.avax.network/bulletin/testnet/rpc'],
    },
    public: {
      http: ['https://subnets.avax.network/bulletin/testnet/rpc'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Avalanche Subnet Explorer',
      url: 'https://subnets-test.avax.network/bulletin',
    },
  },
  testnet: true,
} as const satisfies Chain;

export const CHAIN = {
  AMPLIFY,
  BULLETIN,
  CONDUIT,
};

export const CHAINS = Object.values(CHAIN);
