import type { EvmTeleporterChain } from '@/constants/chains';
import { useDroppable } from '@dnd-kit/core';
import { memo, type PropsWithChildren } from 'react';
import { FancyAvatar } from '../fancy-avatar';

export const DroppableChainColumn = memo(({ children, chain }: PropsWithChildren<{ chain: EvmTeleporterChain }>) => {
  const { isOver, active, setNodeRef } = useDroppable({
    id: `droppable-${chain.chainId}`,
    data: chain,
  });

  const isOverByOtherChain = isOver && active?.data?.current?.chainId !== chain.chainId;

  const style = {
    backgroundColor: isOverByOtherChain ? 'green' : undefined,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="p-4 flex flex-col gap-4"
    >
      <div className="flex items-center gap-4 justify-center">
        <FancyAvatar
          src={chain.logoUrl}
          label={chain.shortName}
          className="w-14 h-14"
        />
        <span className="text-2xl font-medium tracking-wide">{chain.name}</span>
      </div>
      {children}
    </div>
  );
});
DroppableChainColumn.displayName = 'DroppableChainColumn';
