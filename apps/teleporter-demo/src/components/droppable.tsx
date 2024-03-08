import { cn } from '@/utils/cn';
import { type UseDroppableArguments, useDroppable } from '@dnd-kit/core';
import { Slot } from '@radix-ui/react-slot';
import { memo, type HTMLAttributes, type ReactElement } from 'react';

export const Droppable = memo(
  ({
    id,
    data,
    className,
    ...rest
  }: HTMLAttributes<HTMLDivElement> &
    Pick<UseDroppableArguments, 'id' | 'data'> & {
      id: string;
      children: ReactElement; // Use ReactElement instead of ReactNode since we need a child that can accept a ref
    }) => {
    const { isOver, over, setNodeRef } = useDroppable({
      id,
      data,
    });
    return (
      <Slot
        ref={setNodeRef}
        className={cn(
          { 'outline-accent outline-dashed outline-4 border-transparent': !!over },
          {
            'bg-primary/10 outline-primary outline-dashed outline-4 border-transparent': isOver,
          },
          className,
        )}
        {...rest}
      />
    );
  },
);
