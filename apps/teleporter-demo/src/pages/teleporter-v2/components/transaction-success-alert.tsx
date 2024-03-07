import Rive from '@rive-app/react-canvas';
import successCheck from '@/assets/success-check.riv?url';
import { cn } from '@/utils/cn';
import { Button, buttonVariants } from '@/ui/button';
import { truncateAddress } from '@/utils/truncate-address';
import { ExternalLink, X } from 'lucide-react';
import { Typography } from '@/ui/typography';
import { useBridgeContext } from '../providers/bridge-provider';

export const TransactionSuccessAlert = () => {
  const { fromChain, transactionReceipt, reset } = useBridgeContext();

  if (!transactionReceipt) {
    throw new Error('TransactionSuccessAlert must be rendered after a successful transaction');
  }

  return (
    <div className="w-full flex flex-col items-center justify-center gap-2 relative">
      <Rive
        className="h-24 w-24 -m-4 inline-flex"
        src={successCheck}
      />
      <Typography
        size="lg"
        className="tracking-wide"
      >
        Bridge Success!
      </Typography>
      <a
        className={cn(buttonVariants({ variant: 'link' }), 'h-6 px-0 font-mono')}
        href={`${fromChain.explorerUrl}/tx/${transactionReceipt.transactionHash}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        {truncateAddress(transactionReceipt.transactionHash, 9)}
        <ExternalLink className="h-4 w-4 ml-1 inline" />
      </a>
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-4 right-4"
        onClick={reset}
      >
        <X />
      </Button>
    </div>
  );
};
