import { memo, type MouseEventHandler, type ReactNode } from 'react';
import { Button } from '@/ui/button';
import { Typography } from '@/ui/typography';
import { Alert, AlertDescription, AlertTitle } from '@/ui/alert';
import { LoadingSpinner } from '@/ui/loading-spinner';

export const SecondaryActionAlert = memo(
  ({
    title,
    description,
    buttonContent,
    onClick,
    isLoading = false,
  }: {
    title: string;
    description: string;
    buttonContent: ReactNode;
    onClick?: MouseEventHandler<HTMLButtonElement>;
    isLoading?: boolean;
  }) => {
    return (
      <Alert variant="info">
        <AlertTitle>
          <Typography size="md">{title}</Typography>
        </AlertTitle>
        <AlertDescription className="flex flex-col gap-4">
          <Typography size="xs">{description}</Typography>
          <Button
            type="submit"
            className="w-full"
            startIcon={isLoading && <LoadingSpinner />}
            disabled={isLoading}
            onClick={onClick}
          >
            {buttonContent}
          </Button>
        </AlertDescription>
      </Alert>
    );
  },
);
SecondaryActionAlert.displayName = 'SecondaryActionAlert';
