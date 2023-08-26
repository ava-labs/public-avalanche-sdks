import { AutoAnimate } from '@/ui/auto-animate';
import { Button, type ButtonProps } from '@/ui/button';
import { LoadingSpinner } from '@/ui/loading-spinner';
import { cn } from '@/utils/cn';

export const LoadingButton = ({ isLoading, children, className, ...rest }: ButtonProps & { isLoading: boolean }) => {
  return (
    <Button
      className={cn('rounded-full', className)}
      disabled={isLoading}
      {...rest}
    >
      {isLoading ? (
        <AutoAnimate config={{ duration: 150 }}>
          <LoadingSpinner />
        </AutoAnimate>
      ) : (
        <AutoAnimate config={{ duration: 150 }}>{children}</AutoAnimate>
      )}
    </Button>
  );
};
