import { PageContainer } from './components/page-container';
import { TeleporterForm } from './components/teleporter-form';
import { Card, CardContent, CardTitle } from './ui/card';
import { ThemeProvider } from './ui/theme-provider';
import { WalletProvider } from './providers/wallet-provider';

export default function App() {
  return (
    <>
      <ThemeProvider
        defaultTheme="dark"
        storageKey="teleporter-ui-theme"
      >
        <WalletProvider>
          <PageContainer>
            <div className="flex min-w-full justify-center">
              <Card className="flex max-w-md grow">
                <CardContent>
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
        </WalletProvider>
      </ThemeProvider>
    </>
  );
}
