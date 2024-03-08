import Rive from '@rive-app/react-canvas';
import successCheck from '@/assets/success-check.riv?url';
import { cn } from '@/utils/cn';
import { Button, buttonVariants } from '@/ui/button';
import { truncateAddress } from '@/utils/truncate-address';
import { ExternalLink, X } from 'lucide-react';
import { Typography } from '@/ui/typography';
import { useBridgeContext } from '../providers/bridge-provider';
import { Badge } from '@/ui/badge';
import { ResetIcon } from '@radix-ui/react-icons';

export const TransactionSuccessAlert = () => {
  const { fromChain, transactionReceipt, reset } = useBridgeContext();

  if (!transactionReceipt) {
    throw new Error('TransactionSuccessAlert must be rendered after a successful transaction');
  }

  return (
    <div className="w-full flex flex-col items-center justify-center gap-2 py-4 relative">
      <div className="flex flex-col items-center justify-center gap-2 grow">
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
        <Badge variant="outline">
          <a
            className={cn(buttonVariants({ variant: 'link' }), 'h-6 px-0 font-mono')}
            href={`${fromChain.explorerUrl}/tx/${transactionReceipt.transactionHash}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {truncateAddress(transactionReceipt.transactionHash, 20)}
            <ExternalLink className="inline" />
          </a>
        </Badge>
      </div>
      <Button
        variant="secondary"
        size="sm"
        onClick={reset}
      >
        <ResetIcon />
        Back to Bridge
      </Button>
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
