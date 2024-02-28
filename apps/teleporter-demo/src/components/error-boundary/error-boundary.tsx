import { memo, type PropsWithChildren } from 'react';
import { ErrorBoundary as ReactErrorBoundary, type FallbackProps } from 'react-error-boundary';
import { ErrorBoundaryFallback } from './error-boundary-fallback';

const fallbackRender = ({ error }: FallbackProps) => <ErrorBoundaryFallback error={error} />;

export const ErrorBoundary = memo((props: PropsWithChildren) => (
  <ReactErrorBoundary
    fallbackRender={fallbackRender}
    {...props}
  />
));
