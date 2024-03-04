import type { EvmTeleporterChain } from '@/constants/chains';
import { cn } from '@/utils/cn';
import { useDroppable, UseDroppableArguments } from '@dnd-kit/core';
import { Slot } from '@radix-ui/react-slot';
import { memo, type HTMLAttributes, type ReactElement } from 'react';

export const Droppable = memo(
  ({
    id,
    data,
    ...rest
  }: HTMLAttributes<HTMLDivElement> &
    Pick<UseDroppableArguments, 'id' | 'data'> & {
      id: string;
      children: ReactElement; // Use ReactElement instead of ReactNode since we need a child that can accept a ref
    }) => {
    const { isOver, setNodeRef } = useDroppable({
      id,
      data,
    });
    return (
      <Slot
        ref={setNodeRef}
        className={cn({
          'bg-primary/10 outline-4 outline-dashed outline-border border-transparent': isOver,
        })}
        {...rest}
      />
    );
  },
);

export const DroppableChain = memo(
  ({
    chain,
    ...rest
  }: HTMLAttributes<HTMLDivElement> & {
    chain: EvmTeleporterChain;
    children: ReactElement; // Use ReactElement instead of ReactNode since we need a child that can accept a ref
  }) => {
    const { isOver, active, setNodeRef } = useDroppable({
      id: `droppable-${chain.chainId}`,
      data: chain,
    });
    const isOverByOtherChain = isOver && active?.data?.current?.chainId !== chain.chainId;

    return (
      <Slot
        ref={setNodeRef}
        className={cn({
          'bg-primary/10 outline-4 outline-dashed outline-border border-transparent': isOverByOtherChain,
        })}
        {...rest}
      />
    );
  },
);
DroppableChain.displayName = 'Draggable';
