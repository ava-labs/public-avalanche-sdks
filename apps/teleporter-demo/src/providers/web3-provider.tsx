import { TELEPORTER_CONFIG } from '@/constants/chains';
import { WagmiProvider } from 'wagmi';
import { type PropsWithChildren } from 'react';
import { WALLETCONNECT_V2_CORE_PROJECT_ID } from '@/constants';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { defaultWagmiConfig } from '@web3modal/wagmi/react/config';
import { createWeb3Modal } from '@web3modal/wagmi/react';
import { mapChainToWagmiChain } from '@/utils/map-chain-to-wagmi-chain';

const queryClient = new QueryClient();

// Wagmi requires a tuple.
const chains = [
  mapChainToWagmiChain(TELEPORTER_CONFIG.chains[0]),
  mapChainToWagmiChain(TELEPORTER_CONFIG.chains[1]),
  mapChainToWagmiChain(TELEPORTER_CONFIG.chains[2]),
] as const;

const config = defaultWagmiConfig({
  chains,
  projectId: WALLETCONNECT_V2_CORE_PROJECT_ID,
  metadata: {
    name: 'OhMyWarp!',
    description:
      'A demo app for Teleporter, a new cross-chain messaging protocol built on top of Avalanche Warp Messaging',
    url: 'https://ohmywarp.com/', // origin must match your domain & subdomain
    icons: ['https://avatars.githubusercontent.com/u/37784886'],
  },
});

// 3. Create modal
createWeb3Modal({
  wagmiConfig: config,
  projectId: WALLETCONNECT_V2_CORE_PROJECT_ID,
  enableAnalytics: true, // Optional - defaults to your Cloud configuration
});

export const Web3Provider = ({ children }: PropsWithChildren) => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
};
