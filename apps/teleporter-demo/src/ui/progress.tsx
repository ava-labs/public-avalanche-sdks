import * as React from 'react';
import * as ProgressPrimitive from '@radix-ui/react-progress';

import { cn } from '@/utils/cn';

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> & {
    indicatorProps?: ProgressPrimitive.ProgressIndicatorProps;
  }
>(({ className, value, indicatorProps, ...props }, ref) => (
  <ProgressPrimitive.Root
    ref={ref}
    className={cn('relative h-2 w-full overflow-hidden rounded-full bg-primary/20', className)}
    {...props}
  >
    <ProgressPrimitive.Indicator
      {...indicatorProps}
      className={cn('h-full w-full flex-1 bg-primary transition-all', indicatorProps?.className)}
      style={{ transform: `translateX(-${100 - (value || 0)}%)`, ...indicatorProps?.style }}
    />
  </ProgressPrimitive.Root>
));
Progress.displayName = ProgressPrimitive.Root.displayName;

export { Progress };
