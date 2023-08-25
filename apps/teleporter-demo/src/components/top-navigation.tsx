import * as React from 'react';

import { cn } from '@/utils/cn';
import { Newspaper } from 'lucide-react';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/ui/navigation-menu';
import { ConnectWalletButton } from './connect-wallet-button';

export function TopNavigation() {
  return (
    <NavigationMenu className="py-2">
      <NavigationMenuList className="max-w-sm">
        <NavigationMenuItem>
          <NavigationMenuTrigger>Read More</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
              <li className="row-span-3">
                <NavigationMenuLink asChild>
                  <a
                    className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                    href="https://medium.com/avalancheavax/avalanche-warp-messaging-awm-launches-with-the-first-native-subnet-to-subnet-message-on-avalanche-c0ceec32144a"
                  >
                    <Newspaper className="h-6 w-6" />
                    <div className="mb-2 mt-4 text-lg font-medium">Teleporter</div>
                    <p className="text-sm leading-tight text-muted-foreground">The future of interoperability.</p>
                  </a>
                </NavigationMenuLink>
              </li>
              <ListItem
                href="https://avax.network/"
                title="Avalanche"
              >
                Build anything you want, any way you want on the lightning fast, scalable blockchain that won’t let you
                down.
              </ListItem>
              <ListItem
                href="https://docs.avax.network/learn/avalanche/subnets-overview"
                title="Subnets"
              >
                Learn more about how Subnets make scaling with blockchain easy.
              </ListItem>
              <ListItem
                href="/docs/installation"
                title="Avalanche Warp Messaging"
              >
                An inter-subnet communication layer.
              </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink>
            <ConnectWalletButton />
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

const ListItem = React.forwardRef<React.ElementRef<'a'>, React.ComponentPropsWithoutRef<'a'>>(
  ({ className, title, children, ...props }, ref) => {
    return (
      <li>
        <NavigationMenuLink asChild>
          <a
            ref={ref}
            className={cn(
              'block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
              className,
            )}
            {...props}
          >
            <div className="text-sm font-medium leading-none">{title}</div>
            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">{children}</p>
          </a>
        </NavigationMenuLink>
      </li>
    );
  },
);
ListItem.displayName = 'ListItem';
