import { memo, useEffect, useState, type ComponentProps } from 'react';
import { cn } from '@/utils/cn';
import { Slot } from '@radix-ui/react-slot';

type FlashingUpdateProps = {
  flashKeys?: unknown[];
} & ComponentProps<typeof Slot>;

export const FlashingUpdate = memo(function FlashingUpdate({
  className,
  flashKeys,
  children,
  ...rest
}: FlashingUpdateProps) {
  const [flashing, setFlashing] = useState<boolean>(false);

  useEffect(() => {
    setFlashing(true);
    const timeout = setTimeout(() => {
      setFlashing(false);
    }, 1000);

    return () => clearTimeout(timeout);
  }, flashKeys);

  return (
    <Slot
      className={cn({ 'animate-pulse-flashing': flashing }, className)}
      {...rest}
    >
      {children}
    </Slot>
  );
});
