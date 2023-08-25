import { Home } from './pages/home/home';
import { ThemeProvider } from './ui/theme-provider';

export default function App() {
  return (
    <>
      <ThemeProvider
        defaultTheme="dark"
        storageKey="teleporter-ui-theme"
      >
        <Home />
      </ThemeProvider>
    </>
  );
}
