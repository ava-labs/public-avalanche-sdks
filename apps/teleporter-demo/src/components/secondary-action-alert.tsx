import { memo, type PropsWithChildren } from 'react';
import { Typography } from '@/ui/typography';
import { Alert, AlertDescription, AlertTitle } from '@/ui/alert';

export const SecondaryActionAlert = memo(
  ({
    title,
    description,
    children,
  }: PropsWithChildren<{
    title: string;
    description: string;
  }>) => {
    return (
      <Alert variant="info">
        <AlertTitle>
          <Typography size="md">{title}</Typography>
        </AlertTitle>
        <AlertDescription className="flex flex-col gap-4">
          <Typography size="xs">{description}</Typography>
          {children}
        </AlertDescription>
      </Alert>
    );
  },
);
SecondaryActionAlert.displayName = 'SecondaryActionAlert';
