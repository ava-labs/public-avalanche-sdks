import { Button, type ButtonProps } from '@/ui/button';

import { useAccount } from 'wagmi';
import { SettingsMenu } from './settings-menu';
import { cn } from '@/utils/cn';
import { useWeb3Modal } from '@web3modal/wagmi/react';

export const ConnectWalletButton = ({ className, ...rest }: ButtonProps) => {
  const { address, isConnected } = useAccount();
  const { open } = useWeb3Modal();

  if (isConnected && address) {
    return <SettingsMenu />;
  }

  return (
    <Button
      variant="outline"
      className={cn('rounded-full', className)}
      onClick={() => open()}
      {...rest}
    >
      Connect Wallet
    </Button>
  );
};
