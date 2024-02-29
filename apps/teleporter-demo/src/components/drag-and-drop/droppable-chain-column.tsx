import type { EvmTeleporterChain } from '@/constants/chains';
import { useDroppable } from '@dnd-kit/core';
import { memo, type PropsWithChildren } from 'react';
import { FancyAvatar } from '../fancy-avatar';
import { useAccount, useBalance } from 'wagmi';
import { formatUnits } from 'viem';
import { formatStringNumber } from '@/utils/format-string';
import { Skeleton } from '@/ui/skeleton';
import { cn } from '@/utils/cn';

export const DroppableChainColumn = memo(({ children, chain }: PropsWithChildren<{ chain: EvmTeleporterChain }>) => {
  const { isOver, active, setNodeRef } = useDroppable({
    id: `droppable-${chain.chainId}`,
    data: chain,
  });
  const { address } = useAccount();
  const { data: gasBalance, isLoading: isLoadingGasBalance } = useBalance({
    address,
    chainId: Number(chain.chainId),
  });

  const isOverByOtherChain = isOver && active?.data?.current?.chainId !== chain.chainId;

  return (
    <div ref={setNodeRef}>
      <div className={cn('rounded-lg h-full p-4 flex flex-col gap-4', isOverByOtherChain ? 'bg-primary/5' : '')}>
        <div className="flex items-center gap-4">
          <FancyAvatar
            src={chain.logoUrl}
            label={chain.shortName}
            className="w-14 h-14"
          />
          <div className="flex flex-col">
            <span className="text-2xl font-medium tracking-wider">{chain.name}</span>
            <div className="flex items-center gap-1">
              <span className="text-md text-muted-foreground">Gas:</span>
              {isLoadingGasBalance ? (
                <Skeleton className="w-16 h-5" />
              ) : (
                <span className="text-md">
                  <span className="font-mono">
                    {gasBalance ? formatStringNumber(formatUnits(gasBalance.value, gasBalance.decimals)) : 0}
                  </span>{' '}
                  {chain.networkToken.symbol}
                </span>
              )}
            </div>
          </div>
        </div>
        {children}
      </div>
    </div>
  );
});
DroppableChainColumn.displayName = 'DroppableChainColumn';
