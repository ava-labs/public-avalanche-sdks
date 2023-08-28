import { PageContainer } from './components/page-container';
import { ThemeProvider } from './ui/theme-provider';
import { WalletProvider } from './providers/wallet-provider';
import { TooltipProvider } from './ui/tooltip';
import { Suspense } from 'react';
import { LoadingPage } from './pages/loading-page';
import { Toaster } from './ui/toaster';
import { Router } from './router';

export default function App() {
  return (
    <>
      <ThemeProvider
        defaultTheme="dark"
        storageKey="teleporter-ui-theme"
      >
        <TooltipProvider>
          <WalletProvider>
            <Suspense fallback={<LoadingPage />}>
              <PageContainer>
                <Router />
              </PageContainer>
            </Suspense>
          </WalletProvider>
          <Toaster />
        </TooltipProvider>
      </ThemeProvider>
    </>
  );
}
