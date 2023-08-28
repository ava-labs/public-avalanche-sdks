import { TeleporterForm } from '@/components/teleporter-form';
import { Card, CardContent, CardTitle } from '@/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/ui/tabs';
import { MintForm } from '@/components/mint-form';

import {
  useNavigate,
  useRouterState,
  Outlet,
  RouterProvider,
  Router as TanstackRouter,
  Route,
  RootRoute,
} from '@tanstack/react-router';

/**
 * Create a Root route
 */
const Root = () => {
  const navigate = useNavigate();
  const { location } = useRouterState();

  return (
    <Tabs
      defaultValue="teleport"
      className="w-full mt-4 sm:mt-8"
      value={location.pathname}
    >
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger
          value="/"
          onClick={() => {
            navigate({
              to: '/',
            });
          }}
        >
          Teleport
        </TabsTrigger>
        <TabsTrigger
          value="/mint"
          onClick={() => {
            navigate({
              to: '/mint',
            });
          }}
        >
          Mint
        </TabsTrigger>
      </TabsList>
      <Outlet />
    </Tabs>
  );
};
const rootRoute = new RootRoute({
  component: Root,
});

/**
 * Create an index route for Teleporter
 */
const Index = () => {
  return (
    <TabsContent value="/">
      <Card className="flex grow">
        <CardContent className="w-full max-sm:px-0">
          <CardTitle>
            <span className="ml-6">Teleport</span>
          </CardTitle>
          <CardContent>
            <TeleporterForm />
          </CardContent>
        </CardContent>
      </Card>
    </TabsContent>
  );
};
export const indexRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/',
  component: Index,
});

/**
 * Create a Mint route
 */
export const mintRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/mint',
  component: Mint,
});
function Mint() {
  return (
    <TabsContent value="/mint">
      <Card className="flex grow">
        <CardContent className="w-full max-sm:px-0">
          <CardTitle>
            <span className="ml-6">Mint</span>
          </CardTitle>
          <CardContent>
            <MintForm />
          </CardContent>
        </CardContent>
      </Card>
    </TabsContent>
  );
}

// Create the router using your route tree
const router = new TanstackRouter({ routeTree: rootRoute.addChildren([indexRoute, mintRoute]) });

// Register your router for maximum type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export const Router = () => {
  return <RouterProvider router={router} />;
};
