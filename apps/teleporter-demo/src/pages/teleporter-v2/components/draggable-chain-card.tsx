import { FancyAvatar } from '@/components/fancy-avatar';
import type { EvmTeleporterChain } from '@/constants/chains';
import { ThreeDCardContainer, ThreeDCardBody, ThreeDCardItem } from '@/ui/3d-card';
import { Card, CardContent } from '@/ui/card';
import { Typography } from '@/ui/typography';
import { useDndMonitor, useDraggable, useDroppable } from '@dnd-kit/core';
import { Slot } from '@radix-ui/react-slot';
import { GripVertical } from 'lucide-react';
import { memo, type HTMLAttributes } from 'react';
import { isEvmTeleporterDndData } from '../utils/type-guards';
import { useActivelyDraggedChain } from '../hooks/use-actively-dragged-chain';
import { cn } from '@/utils/cn';
import { useBridgeContext } from '../providers/bridge-provider';

const DroppableChain = ({ chain, ...rest }: { chain: EvmTeleporterChain } & HTMLAttributes<HTMLDivElement>) => {
  const { isOver, active, setNodeRef } = useDroppable({
    id: `droppable-${chain.chainId}`,
    data: {
      chain,
    },
  });

  const activeChain = isEvmTeleporterDndData(active?.data.current) ? active.data.current.chain : undefined;
  // Whether a chain other than this on is being dragged over this one.
  const isOverByDifferentChain = isOver && activeChain?.chainId !== chain.chainId;

  const { form } = useBridgeContext();
  useDndMonitor({
    onDragEnd: ({ active, over }) => {
      // If one chain is dropped on top of another, set the from and to chain IDs in the form.
      const activeChain = isEvmTeleporterDndData(active?.data.current) ? active.data.current.chain : undefined;
      const overChain = isEvmTeleporterDndData(over?.data.current) ? over.data.current.chain : undefined;
      if (activeChain && overChain && activeChain.chainId !== overChain.chainId) {
        form.setValue('fromChainId', activeChain.chainId);
        form.setValue('toChainId', overChain.chainId);
      }
    },
  });

  return (
    <Slot
      ref={setNodeRef}
      {...rest}
      className={cn(
        { 'bg-primary/5 outline-primary outline-dashed outline-4': isOverByDifferentChain },
        rest.className,
      )}
    />
  );
};

export const DraggableChainCard = memo(
  ({ chain, ...rest }: { chain: EvmTeleporterChain } & HTMLAttributes<HTMLDivElement>) => {
    const { attributes, listeners, setNodeRef } = useDraggable({
      id: `draggable-${chain.chainId}`,
      data: {
        chain,
      },
    });
    const activelyDraggedChain = useActivelyDraggedChain();

    return (
      <div
        ref={setNodeRef}
        {...rest}
        {...listeners}
        {...attributes}
        className={cn(chain === activelyDraggedChain ? '!opacity-50 grayscale' : '!opacity-100', rest.className)}
      >
        <ThreeDCardContainer>
          <DroppableChain
            chain={chain}
            className="relative group"
          >
            <Card>
              <GripVertical className="absolute top-2 left-2 text-primary-foreground opacity-20 group-hover:opacity-100 transition-opacity duration-300" />
              <CardContent>
                <ThreeDCardBody>
                  <ThreeDCardItem translateZ={70}>
                    <div className="flex flex-col items-center gap-2 whitespace-break-spaces">
                      <FancyAvatar
                        src={chain.logoUrl}
                        label={chain.shortName}
                      />
                      <Typography
                        size="md"
                        className="text-center"
                      >
                        {chain.name}
                      </Typography>
                    </div>
                  </ThreeDCardItem>
                </ThreeDCardBody>
              </CardContent>
            </Card>
          </DroppableChain>
        </ThreeDCardContainer>
      </div>
    );
  },
);
DraggableChainCard.displayName = 'DraggableChainCard';
