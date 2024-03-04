import { TELEPORTER_CONFIG } from '@/constants/chains';
import { WagmiProvider } from 'wagmi';
import { type PropsWithChildren } from 'react';
import { WALLETCONNECT_V2_CORE_PROJECT_ID } from '@/constants';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { defaultWagmiConfig } from '@web3modal/wagmi/react/config';
import { createWeb3Modal } from '@web3modal/wagmi/react';

const queryClient = new QueryClient();

const config = defaultWagmiConfig({
  chains: TELEPORTER_CONFIG.wagmiChains,
  projectId: WALLETCONNECT_V2_CORE_PROJECT_ID,
  metadata: {
    name: 'OhMyWarp!',
    description:
      'A demo app for Teleporter, a new cross-chain messaging protocol built on top of Avalanche Warp Messaging',
    url: 'https://ohmywarp.com/', // origin must match your domain & subdomain
    icons: ['https://avatars.githubusercontent.com/u/37784886'],
  },
  enableCoinbase: false,
  enableEmail: false,
  enableEIP6963: false,
});

// 3. Create modal
// ID for Core Wallet in WalletConnect V2
const CORE_WALLET_CONNECT_ID = 'f323633c1f67055a45aac84e321af6ffe46322da677ffdd32f9bc1e33bafe29c';
createWeb3Modal({
  wagmiConfig: config,
  projectId: WALLETCONNECT_V2_CORE_PROJECT_ID,
  enableAnalytics: true, // Optional - defaults to your Cloud configuration
  featuredWalletIds: [CORE_WALLET_CONNECT_ID], // Feature core wallet
});

export const Web3Provider = ({ children }: PropsWithChildren) => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
};
