import { FancyAvatar } from '@/components/fancy-avatar';
import { memo, type HTMLAttributes } from 'react';
import { useBridgeContext } from '../providers/bridge-provider';
import { Typography } from '@/ui/typography';
import { useDroppable, useDndMonitor } from '@dnd-kit/core';
import type { EvmTeleporterChain } from '@/constants/chains';
import { cn } from '@/utils/cn';
import { Card, CardContent } from '@/ui/card';
import { isEvmTeleporterDndData } from '../utils/type-guards';
import { SwapButton } from './swap-button';

const DroppableFromToChain = ({
  fromOrTo,
  chain,
  ...rest
}: { fromOrTo: 'from' | 'to'; chain: EvmTeleporterChain } & HTMLAttributes<HTMLDivElement>) => {
  const id = `droppable-${fromOrTo}`;
  const { isOver, setNodeRef } = useDroppable({
    id,
  });
  const { setFromChain, setToChain } = useBridgeContext();
  useDndMonitor({
    onDragEnd: ({ active, over }) => {
      // If one chain is dropped on top of another, set the from and to chain IDs in the form.
      const activeChain = isEvmTeleporterDndData(active?.data.current) ? active.data.current.chain : undefined;
      if (!activeChain || !over || over.id !== id) {
        return;
      }

      if (fromOrTo === 'from') {
        setFromChain(activeChain);
        return;
      }
      if (fromOrTo === 'to') {
        setToChain(activeChain);
        return;
      }
    },
  });

  return (
    <Card
      ref={setNodeRef}
      {...rest}
      className={cn(
        'grow basis-0',
        {
          'bg-primary/5 outline-primary outline-dashed outline-4': isOver,
        },
        rest.className,
      )}
    >
      <CardContent className="flex items-center gap-2">
        <FancyAvatar
          src={chain.logoUrl}
          label={chain.name}
        />
        <Typography size="lg">{chain.shortName}</Typography>
      </CardContent>
    </Card>
  );
};

export const BridgeForm = memo(() => {
  const { fromChain, toChain } = useBridgeContext();

  return (
    <div className="flex gap-2 items-center">
      <DroppableFromToChain
        chain={fromChain}
        fromOrTo="from"
      />
      <SwapButton />
      <DroppableFromToChain
        chain={toChain}
        fromOrTo="to"
      />
    </div>
  );
});
BridgeForm.displayName = 'BridgeForm';
