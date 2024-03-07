import { AutoAnimate } from '@/ui/auto-animate';
import { Button, type ButtonProps } from '@/ui/button';
import { cn } from '@/utils/cn';
import { ArrowDown, ArrowUpDown } from 'lucide-react';
import { useState } from 'react';
import { useBridgeContext } from '../providers/bridge-provider';

export const SwapButton = ({ className, ...rest }: ButtonProps) => {
  const [isHovered, setIsHovered] = useState(false);

  const { toChain, setChainValue } = useBridgeContext();

  return (
    <Button
      variant="secondary"
      className={cn('rounded-full w-10 h-10 bg-neutral-900 border border-neutral-800', className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={(e) => {
        e.preventDefault();
        setChainValue('fromChainId', toChain);
      }}
      {...rest}
    >
      <AutoAnimate config={{ duration: 150 }}>{isHovered ? <ArrowUpDown /> : <ArrowDown />}</AutoAnimate>
    </Button>
  );
};
