import { PageContainer } from './components/page-container';
import { TeleporterForm } from './components/teleporter-form';
import { Card, CardContent, CardTitle } from './ui/card';
import { ThemeProvider } from './ui/theme-provider';
import { WalletProvider } from './providers/wallet-provider';
import { TooltipProvider } from './ui/tooltip';
import { BalancesProvider } from './providers/balances-provider';
import { Suspense } from 'react';
import { LoadingPage } from './pages/loading-page';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { MintForm } from './components/mint-form';
import { Toaster } from './ui/toaster';

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
                  <Tabs
                    defaultValue="teleport"
                    className="w-full mt-4 sm:mt-8"
                  >
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="teleport">Teleport</TabsTrigger>
                      <TabsTrigger value="mint">Mint</TabsTrigger>
                    </TabsList>
                    <TabsContent value="teleport">
                      <Card className="flex grow">
                        <CardContent className="w-full">
                          <CardTitle>
                            <span className="ml-6">Teleport</span>
                          </CardTitle>
                          <CardContent>
                            <TeleporterForm />
                          </CardContent>
                        </CardContent>
                      </Card>
                    </TabsContent>
                    <TabsContent value="mint">
                      <Card className="flex grow">
                        <CardContent className="w-full">
                          <CardTitle>
                            <span className="ml-6">Mint</span>
                          </CardTitle>
                          <CardContent>
                            <MintForm />
                          </CardContent>
                        </CardContent>
                      </Card>
                    </TabsContent>
                  </Tabs>
                </PageContainer>
              </BalancesProvider>
            </Suspense>
          </WalletProvider>
          <Toaster />
        </TooltipProvider>
      </ThemeProvider>
    </>
  );
}
