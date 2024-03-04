import type { EvmTeleporterChain } from '@/constants/chains';
import { cn } from '@/utils/cn';
import { useDraggable } from '@dnd-kit/core';
import { Slot } from '@radix-ui/react-slot';
import { memo, type HTMLAttributes, type ReactElement } from 'react';

export const DraggableChain = memo(
  ({
    chain,
    ...rest
  }: HTMLAttributes<HTMLDivElement> & {
    chain: EvmTeleporterChain;
    children: ReactElement; // Use ReactElement instead of ReactNode since we need a child that can accept a ref
  }) => {
    const { attributes, listeners, isDragging, setNodeRef } = useDraggable({
      id: `draggable-${chain.chainId}`,
      data: chain,
    });

    return (
      <Slot
        ref={setNodeRef}
        className={cn(
          'transition-opacity duration-300 ease-in-out',
          isDragging ? '!opacity-50 grayscale' : '!opacity-100',
        )}
        {...rest}
        {...listeners}
        {...attributes}
      />
    );
  },
);
DraggableChain.displayName = 'Draggable';
