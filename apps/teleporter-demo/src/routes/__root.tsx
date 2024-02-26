import { Tabs, TabsList, TabsTrigger } from '@/ui/tabs';

import { useNavigate, useRouterState, Outlet, createRootRoute } from '@tanstack/react-router';

export const Route = createRootRoute({
  component: () => {
    const navigate = useNavigate();
    const { location } = useRouterState();

    return (
      <Tabs
        defaultValue="teleport"
        className="w-full"
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
            Bridge
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
  },
});
