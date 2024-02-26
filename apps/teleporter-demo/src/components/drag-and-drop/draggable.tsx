import type { EvmTeleporterChain } from '@/constants/chains';
import { useDraggable } from '@dnd-kit/core';
import { Slot } from '@radix-ui/react-slot';
import { memo, type HTMLAttributes, type ReactElement } from 'react';

export const Draggable = memo(
  ({
    chain,
    ...rest
  }: HTMLAttributes<HTMLDivElement> & {
    chain: EvmTeleporterChain;
    children: ReactElement; // Use ReactElement instead of ReactNode since we need a child that can accept a ref
  }) => {
    const { attributes, listeners, setNodeRef } = useDraggable({
      id: `draggable-${chain.chainId}`,
      data: chain,
    });

    return (
      <Slot
        ref={setNodeRef}
        {...rest}
        {...listeners}
        {...attributes}
      />
    );
  },
);
Draggable.displayName = 'Draggable';
