import { Button, buttonVariants } from '@/ui/button';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/ui/sheet';
import { cn } from '@/utils/cn';
import { GitHubLogoIcon } from '@radix-ui/react-icons';
import { Heart, InfoIcon } from 'lucide-react';

import { Link } from '@tanstack/react-router';
import { TELEPORTER_CONFIG } from '@/constants/chains';
import { AvalancheColorIcon } from './avalanche-icon';
import { ScrollArea } from '@/ui/scroll-area';

const CHAIN_NAMES = TELEPORTER_CONFIG.chains.map((chain) => chain.shortName);
const CHAINS_LABEL = `${CHAIN_NAMES[0]}, ${CHAIN_NAMES[1]}, and ${CHAIN_NAMES[2]}`;

export const WhatsTeleporterSheet = () => {
  return (
    <Sheet>
      <div className="flex justify-center mt-2">
        <SheetTrigger asChild>
          <Button
            size="sm"
            variant="ghost-primary"
          >
            <InfoIcon className="mr-2 w-4 h-4" /> What's Teleporter?
          </Button>
        </SheetTrigger>
      </div>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>What's Teleporter?</SheetTitle>
          <SheetDescription>
            <a
              className={cn(buttonVariants({ variant: 'ghost', size: 'icon' }), 'text-foreground')}
              href="https://github.com/ava-labs/teleporter"
              target="_blank"
              rel="noopener noreferrer"
            >
              <GitHubLogoIcon className="w-6 h-6" />
            </a>
            <a
              className={cn(buttonVariants({ variant: 'ghost', size: 'icon' }), 'text-foreground')}
              href="https://github.com/ava-labs/public-avalanche-sdks/tree/main/apps/teleporter-demo"
              target="_blank"
              rel="noopener noreferrer"
            >
              <GitHubLogoIcon className="w-6 h-6" />
            </a>
            <a
              className={cn(buttonVariants({ variant: 'ghost', size: 'icon' }))}
              href="https://www.avax.network"
              target="_blank"
              rel="noopener noreferrer"
            >
              <AvalancheColorIcon size={28} />
            </a>
          </SheetDescription>
        </SheetHeader>
        <ScrollArea className="h-full pb-20">
          <div className="text-muted-foreground">
            <p className="mt-4">
              Teleporter is a new cross-chain messaging protocol built on top of Avalanche Warp Messaging. It provides
              smart contract developers an easy, native way to call contracts on other EVM-based chains within
              Avalanche, opening doors to many interoperability opportunities.
            </p>
            <p className="mt-4">
              This demo was built to showcase how easy it is to transfer ERC-20 tokens between Subnets. The three
              subnets in this demo, including {CHAINS_LABEL}, are all equipped with the latest and greatest Teleporter
              smart contracts.
            </p>
            <p className="mt-4">
              To get started, first head to{' '}
              <a
                className={cn(buttonVariants({ variant: 'link', size: 'sm' }), 'text-md px-0 py-0 -my-2')}
                href={TELEPORTER_CONFIG.tlpMintChain.faucetUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                the faucet
              </a>{' '}
              to get your hands on some {CHAINS_LABEL} gas tokens. After that, you can{' '}
              <Link
                className={cn(buttonVariants({ variant: 'link', size: 'sm' }), 'text-md px-0 py-0 -my-2')}
                to="/mint"
              >
                mint
              </Link>{' '}
              the TLP (Teleporter Test Token) ERC-20 on the {TELEPORTER_CONFIG.tlpMintChain.name}. Finally, you can head
              to the{' '}
              <Link
                className={cn(buttonVariants({ variant: 'link', size: 'sm' }), 'text-md px-0 py-0 -my-2')}
                to="/"
              >
                Teleporter Bridge tool
              </Link>{' '}
              to kick off your first teleport and watch your TLP tokens transfer between the three subnets. It's as easy
              as that!
            </p>
            <p className="mt-4">
              For now, you can check out the Teleporter repos at the links up top, and read more at{' '}
              <a
                className={cn(buttonVariants({ variant: 'link', size: 'sm' }), 'text-md px-0 py-0 -my-2')}
                href={
                  'https://medium.com/avalancheavax/avalanche-warp-messaging-awm-launches-with-the-first-native-subnet-to-subnet-message-on-avalanche-c0ceec32144a'
                }
                target="_blank"
                rel="noopener noreferrer"
              >
                our blog
              </a>
              .
            </p>
            <p className="mt-4 inline-flex">
              - <Heart className="mx-2" />
              The Avalanche Team
            </p>
          </div>
        </ScrollArea>
        <SheetFooter>
          <SheetClose asChild>
            <Button type="submit">Save changes</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};
