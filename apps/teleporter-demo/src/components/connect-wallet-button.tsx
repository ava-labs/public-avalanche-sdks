import { useConnectWallet } from '@/hooks/use-connect-wallet';
import { Button } from '@/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/ui/popover';
import { MetaMaskIcon } from '@/icons/metamask';
import { CheckCircle, Loader2, WalletIcon } from 'lucide-react';
import { CoinbaseWalletIcon } from '@/icons/coinbase';

import { CoreText } from './core-text';
import { useToast } from '@/ui/hooks/use-toast';
import { type Connector, useAccount, useDisconnect } from 'wagmi';
import { AutoAnimate } from '@/ui/auto-animate';
import { truncateAddress } from '@/utils/truncate-address';
import { useState } from 'react';

export const ConnectWalletButton = () => {
  const { address, isConnected } = useAccount();
  const { disconnectAsync } = useDisconnect();
  const { connect, connectors, isLoading } = useConnectWallet();
  const [isDisconnectButton, setIsDisconnectButton] = useState(false);

  const { toast } = useToast();

  const handleConnect = (connector?: Connector) => {
    if (connector?.ready) {
      // @ts-expect-error -- I'm not sure why it expects ConnectArgs instead of Connector since this works.
      connect(connector);
    } else {
      const strippedName = connector?.name.split('Wallet').join('');
      toast({
        title: "Can't Connect",
        description: `${strippedName} Wallet not found.`,
      });
    }
    setIsDisconnectButton(false);
  };

  const handleDisconnectButtonClick = async () => {
    await disconnectAsync();

    toast({
      title: 'Disconnected Successfully',
    });
  };

  if (isConnected && address) {
    return (
      <Button
        variant="secondary"
        className="rounded-full font-mono hover:bg-destructive"
        onMouseEnter={() => setIsDisconnectButton(true)}
        onMouseLeave={() => setIsDisconnectButton(false)}
        onClick={handleDisconnectButtonClick}
      >
        {isDisconnectButton ? 'Disconnect' : truncateAddress(address)}
      </Button>
    );
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="rounded-full"
        >
          Connect Wallet
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="sm:max-w-[425px]"
        align="start"
      >
        <AutoAnimate>
          {!isLoading && !isConnected && (
            <>
              <p className="text-sm text-gray-200">Connect with:</p>

              <div className="grid gap-4 py-4">
                <Button
                  variant="outline"
                  className="h-24"
                  onClick={() => handleConnect(connectors.core)}
                >
                  <CoreText />
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleConnect(connectors.metamask)}
                >
                  <span className="space-x-2 inline-flex items-center">
                    <MetaMaskIcon />
                    <p>MetaMask</p>
                  </span>
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleConnect(connectors.coinbase)}
                >
                  <span className="space-x-2 inline-flex items-center">
                    <CoinbaseWalletIcon />
                    <p>Coinbase</p>
                  </span>
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleConnect(connectors.injected)}
                >
                  <span className="space-x-2 inline-flex items-center">
                    <WalletIcon />
                    <p>Web3</p>
                  </span>
                </Button>
              </div>
            </>
          )}
        </AutoAnimate>

        <AutoAnimate>
          {isLoading && !isConnected && (
            <div className="flex-col center">
              <p className="text-sm text-center">Waiting for Approval in Wallet...</p>
              <Loader2 />
            </div>
          )}
        </AutoAnimate>

        <AutoAnimate>
          {isConnected && (
            <div className="center flex justify-center">
              <p className="text-sm">Connected</p>
              <CheckCircle className="stroke-emerald-500 ml-3" />
            </div>
          )}
        </AutoAnimate>
      </PopoverContent>
    </Popover>
  );
};
