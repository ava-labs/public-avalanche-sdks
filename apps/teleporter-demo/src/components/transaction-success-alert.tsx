import { Alert, AlertDescription, AlertTitle } from '@/ui/alert';
import Rive from '@rive-app/react-canvas';
import successCheck from '@/assets/success-check.riv?url';
import { cn } from '@/utils/cn';
import { buttonVariants } from '@/ui/button';
import { truncateAddress } from '@/utils/truncate-address';
import { ExternalLink } from 'lucide-react';
import type { HTMLAttributes } from 'react';
import { capitalize } from 'lodash-es';

export const TransactionSuccessAlert = ({
  explorerBaseUrl,
  txHash,
  actionLabel,
  className,
  children,
  ...rest
}: { explorerBaseUrl: string; txHash: string; actionLabel?: string } & HTMLAttributes<HTMLDivElement>) => {
  return (
    <Alert
      variant="success"
      className={cn(className)}
      {...rest}
    >
      <div className="flex flex-nowrap">
        <Rive
          className="h-8 w-8 inline-flex"
          src={successCheck}
        />
        <div className="ml-2 w-full">
          <AlertTitle>{actionLabel ? capitalize(actionLabel) : 'Transaction'} success!</AlertTitle>
          <AlertDescription>
            <a
              className={cn(buttonVariants({ variant: 'link' }), 'h-6 px-0 font-mono')}
              href={`${explorerBaseUrl}/tx/${txHash}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {truncateAddress(txHash)}
              <ExternalLink className="h-2 w-2 inline" />
            </a>
          </AlertDescription>
        </div>
      </div>
      {children}
    </Alert>
  );
};
