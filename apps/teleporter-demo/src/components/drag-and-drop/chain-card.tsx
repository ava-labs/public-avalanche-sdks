import type { EvmTeleporterChain } from '@/constants/chains';
import { Card, CardContent } from '@/ui/card';
import { FancyAvatar } from '../fancy-avatar';
import { forwardRef, type HTMLAttributes } from 'react';
import { GripVertical } from 'lucide-react';
import { cn } from '@/utils/cn';

export const ChainCard = forwardRef<
  HTMLDivElement,
  { chain: EvmTeleporterChain; draggable?: boolean } & HTMLAttributes<HTMLDivElement>
>(({ chain, draggable = false, className, ...rest }, ref) => {
  return (
    <Card
      {...rest}
      className={cn({ ['relative cursor-grab']: draggable }, className)}
      ref={ref}
    >
      {draggable && <GripVertical className="absolute top-4 left-1" />}
      <CardContent className="flex flex-col items-center gap-2 p-4">
        <FancyAvatar
          src={chain.logoUrl}
          label={chain.shortName}
          className="w-14 h-14"
        />
        <span className="text-lg text-center font-medium tracking-wider">{chain.name}</span>
      </CardContent>
    </Card>
  );
});
