import { Alert, AlertTitle, AlertDescription } from '@/ui/alert';
import type { ErrorRouteComponent } from '@tanstack/react-router';
import { isString } from 'lodash-es';
import { memo, type ComponentProps } from 'react';

export const ErrorBoundaryFallback = memo(({ error, info }: Partial<ComponentProps<ErrorRouteComponent>>) => {
  const errorMessage =
    error instanceof Error ? error.message : isString(error) ? error : 'Please refresh the page and try again.';

  console.error(error, info);

  return (
    <Alert variant="destructive">
      <AlertTitle>Something went wrong!</AlertTitle>
      <AlertDescription>{errorMessage}</AlertDescription>
    </Alert>
  );
});
