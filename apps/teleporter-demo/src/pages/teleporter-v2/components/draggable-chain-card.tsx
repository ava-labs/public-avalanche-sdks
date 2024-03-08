import { FancyAvatar } from '@/components/fancy-avatar';
import type { EvmTeleporterChain } from '@/constants/chains';
import { ThreeDCardContainer, ThreeDCardBody, ThreeDCardItem } from '@/ui/3d-card';
import { Typography } from '@/ui/typography';
import { useDraggable, useDroppable } from '@dnd-kit/core';
import { Slot } from '@radix-ui/react-slot';
import { GripVertical } from 'lucide-react';
import { memo, type HTMLAttributes } from 'react';
import { isEvmTeleporterDndData } from '../utils/type-guards';
import { useActivelyDraggedChain } from '../hooks/use-actively-dragged-chain';
import { cn } from '@/utils/cn';
import { useAccount, useBalance } from 'wagmi';
import { Skeleton } from '@/ui/skeleton';
import { formatEther } from 'viem';

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

  return (
    <Slot
      ref={setNodeRef}
      {...rest}
      className={cn(
        { 'bg-primary/10 outline-primary outline-dashed outline-4': isOverByDifferentChain },
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
    const { address } = useAccount();
    const { data: gasBalance, isLoading: isLoadingGasBalance } = useBalance({
      address,
      chainId: Number(chain.chainId),
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
        <DroppableChain
          chain={chain}
          className="relative group w-full"
        >
          <div className="rounded-lg h-full">
            <ThreeDCardContainer
              outerProps={{ className: cn('group w-full h-full rounded-lg bg-transparent border') }}
              innerProps={{ className: cn('w-full h-full flex flex-col items-center gap-2') }}
            >
              <ThreeDCardItem
                translateZ={40}
                className="absolute top-2 left-2"
              >
                <GripVertical className="text-foreground opacity-20 group-hover:opacity-100 transition-opacity duration-300" />
              </ThreeDCardItem>
              <ThreeDCardBody className="flex flex-col gap-2 items-center grow pt-6 px-10">
                <ThreeDCardItem
                  translateZ={100}
                  className="flex justify-center w-full"
                >
                  <FancyAvatar
                    src={chain.logoUrl}
                    label={chain.shortName}
                    color={chain.primaryColor}
                  />
                </ThreeDCardItem>
                <ThreeDCardItem
                  translateZ={100}
                  className="w-full flex justify-center"
                >
                  <Typography
                    size="md"
                    className="text-center"
                  >
                    {chain.name}
                  </Typography>
                </ThreeDCardItem>
              </ThreeDCardBody>
              <ThreeDCardItem
                translateZ={40}
                className="flex w-full justify-end pb-2 px-2"
              >
                {isLoadingGasBalance ? (
                  <Skeleton className="h-5 w-24" />
                ) : (
                  <Typography
                    size="xs"
                    className="text-muted-foreground"
                  >
                    Gas: {gasBalance ? Number(formatEther(gasBalance.value)).toFixed(2) : 0} {chain.networkToken.symbol}
                  </Typography>
                )}
              </ThreeDCardItem>
            </ThreeDCardContainer>
          </div>
        </DroppableChain>
      </div>
    );
  },
);
DraggableChainCard.displayName = 'DraggableChainCard';
