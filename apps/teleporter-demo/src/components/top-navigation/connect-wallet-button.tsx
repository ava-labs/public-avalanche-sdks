import { Button, type ButtonProps } from '@/ui/button';

import { useAccount } from 'wagmi';
import { SettingsMenu } from './settings-menu';
import { cn } from '@/utils/cn';
import { useWeb3Modal, useWeb3ModalState } from '@web3modal/wagmi/react';
import { LoadingSpinner } from '@/ui/loading-spinner';

export const ConnectWalletButton = ({ className, ...rest }: ButtonProps) => {
  const { address, isConnected, isConnecting } = useAccount();
  const { open: openModal } = useWeb3Modal();
  const { open: isModalOpen } = useWeb3ModalState();

  if (isConnected && address) {
    return <SettingsMenu />;
  }

  return (
    <Button
      variant="outline"
      className={cn('rounded-full', className)}
      onClick={() => openModal()}
      startIcon={(isModalOpen || isConnecting) && <LoadingSpinner />}
      disabled={isModalOpen || isConnecting}
      {...rest}
    >
      Connect Wallet
    </Button>
  );
};
