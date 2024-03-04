import { AutoAnimate } from '@/ui/auto-animate';
import { Button } from '@/ui/button';
import { ArrowRightLeft, ArrowRight } from 'lucide-react';
import { memo, type ButtonHTMLAttributes, useState } from 'react';

export const SwapButton = memo((props: ButtonHTMLAttributes<HTMLButtonElement>) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Button
      variant="ghost"
      size="icon"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      {...props}
    >
      {isHovered ? (
        <AutoAnimate config={{ duration: 150 }}>
          <ArrowRightLeft />
        </AutoAnimate>
      ) : (
        <AutoAnimate config={{ duration: 150 }}>
          <ArrowRight />
        </AutoAnimate>
      )}
    </Button>
  );
});
SwapButton.displayName = 'SwapButton';
