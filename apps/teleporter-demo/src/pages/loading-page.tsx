import { Progress } from '@/ui/progress';
import { cn } from '@/utils/cn';
import { memo } from 'react';

export const LoadingPage = memo(() => {
  return (
    <div className="p-6">
      <Progress
        value={100}
        className="bg-transparent"
        indicatorProps={{
          className: cn('animate-pulse'),
        }}
      />
    </div>
  );
});
