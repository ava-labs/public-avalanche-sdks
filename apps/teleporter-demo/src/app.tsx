import { PageContainer } from './components/page-container';
import { TeleporterForm } from './components/teleporter-form';
import { Card, CardContent, CardTitle } from './ui/card';
import { ThemeProvider } from './ui/theme-provider';
import { WalletProvider } from './providers/wallet-provider';
import { TooltipProvider } from './ui/tooltip';
import { BalancesProvider } from './providers/balances-provider';
import { Suspense } from 'react';
import { LoadingPage } from './pages/loading-page';

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
              <BalancesProvider>
                <PageContainer>
                  <div className="flex min-w-full justify-center">
                    <Card className="flex max-w-xl grow">
                      <CardContent className="w-full">
                        <CardTitle>
                          <h1>Teleporter</h1>
                        </CardTitle>
                        <CardContent>
                          <TeleporterForm />
                        </CardContent>
                      </CardContent>
                    </Card>
                  </div>
                </PageContainer>
              </BalancesProvider>
            </Suspense>
          </WalletProvider>
        </TooltipProvider>
      </ThemeProvider>
    </>
  );
}
