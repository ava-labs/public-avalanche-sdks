import { memo } from 'react';
import { Button } from '@/ui/button';
import { useWeb3Modal, useWeb3ModalState } from '@web3modal/wagmi/react';
import { useAccount } from 'wagmi';
import { cn } from '@/utils/cn';
import { Typography } from '@/ui/typography';
import { Alert, AlertDescription } from '@/ui/alert';
import { LoadingSpinner } from '@/ui/loading-spinner';

export const ConnectWalletAlert = memo(() => {
  const { address, isConnected, isConnecting } = useAccount();
  const { open } = useWeb3Modal();
  const { open: isModalOpen } = useWeb3ModalState();

  if (isConnected && address) {
    return null;
  }

  return (
    <Alert variant="info">
      <AlertDescription className="flex flex-col gap-4">
        <Typography
          size="sm"
          className="text-center"
        >
          Must connect wallet to Bridge.
        </Typography>
        <Button
          className={cn('w-full')}
          onClick={(e) => {
            e.preventDefault();
            open();
          }}
          startIcon={(isModalOpen || isConnecting) && <LoadingSpinner />}
          disabled={isModalOpen || isConnecting}
        >
          Connect Wallet
        </Button>
      </AlertDescription>
    </Alert>
  );
});
