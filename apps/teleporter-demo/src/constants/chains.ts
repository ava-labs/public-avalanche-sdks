import type { Chain } from 'wagmi';

export const AMPLIFY_WAGMI_CONFIG = {
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

export const BULLETIN_WAGMI_CONFIG = {
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

export const CONDUIT_WAGMI_CONFIG = {
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
  AMPLIFY: {
    wagmi: AMPLIFY_WAGMI_CONFIG,
  },
  BULLETIN: {
    wagmi: BULLETIN_WAGMI_CONFIG,
  },
  CONDUIT: {
    wagmi: CONDUIT_WAGMI_CONFIG,
  },
} as const satisfies Record<
  string,
  {
    wagmi: Chain;
  }
>;

export const WAGMI_CHAINS = Object.values(CHAIN).map(({ wagmi }) => wagmi);
