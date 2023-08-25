import { TypographyDemo } from './pages/typography-demo';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { ThemeProvider } from './ui/theme-provider';

export default function App() {
  return (
    <>
      <ThemeProvider
        defaultTheme="dark"
        storageKey="teleporter-ui-theme"
      >
        <h1 className="text-3xl">Hello world!</h1>
        <h1 className="text-3xl font-bold underline">Hello world!</h1>
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">Hello world!</h1>
        <Card>
          <CardContent>
            <Button>Test</Button>
            <h2 className="font-mono text-3xl">test</h2>
          </CardContent>
        </Card>
        <TypographyDemo />
      </ThemeProvider>
    </>
  );
}
