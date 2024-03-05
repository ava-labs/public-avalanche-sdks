import { FancyAvatar } from '@/components/fancy-avatar';
import { DragOverlay, useDndMonitor } from '@dnd-kit/core';
import { isNil } from 'lodash-es';
import { memo } from 'react';
import { snapCenterToCursor } from '@dnd-kit/modifiers';
import { useBridgeContext } from '../providers/bridge-provider';
import { isEvmTeleporterDndData } from '../utils/type-guards';
import { ArrowRight, GripVertical } from 'lucide-react';
import { DroppableId } from './bridge-form';
import { Label } from '@/ui/label';

export const ChainDragOverlay = memo(() => {
  const { activeDrag, setFromChain, setToChain } = useBridgeContext();

  useDndMonitor({
    onDragStart: ({ active }) => {
      const activeChain = isEvmTeleporterDndData(active.data?.current) ? active.data.current.chain : undefined;
      activeChain && activeDrag.setActiveDragChain(activeChain);
    },
    onDragOver: ({ active, over }) => {
      const draggedChain = isEvmTeleporterDndData(active?.data.current) ? active.data.current.chain : undefined;
      const overChain = isEvmTeleporterDndData(over?.data.current) ? over.data.current.chain : undefined;

      // Not dragging a chain, so do nothing.
      if (!draggedChain) {
        return;
      }

      // Dragged over the "fromChainId" form field, set the from chain.
      if (over && over.id === DroppableId.From) {
        activeDrag.setFromChain(draggedChain);
        activeDrag.setToChain(undefined);
        return;
      }

      //Dragged over the "toChainId" form field, set the to chain.
      if (over && over.id === DroppableId.To) {
        activeDrag.setToChain(draggedChain);
        activeDrag.setFromChain(undefined);
        return;
      }

      // If a chain is dragged over another, set the to chain.
      if (overChain) {
        activeDrag.setFromChain(draggedChain);
        activeDrag.setToChain(draggedChain?.chainId === overChain?.chainId ? undefined : overChain);
        return;
      }

      // Dragging over nothing, so reset the chain to its existing value (since we won't update it).
      activeDrag.setFromChain(undefined);
      activeDrag.setToChain(undefined);
      return;
    },
    onDragEnd: () => {
      // Set the chains in the bridge form
      activeDrag.fromChain && setFromChain(activeDrag.fromChain);
      activeDrag.toChain && setToChain(activeDrag.toChain);

      // Reset the active drag state
      activeDrag.setActiveDragChain(undefined);
      activeDrag.setFromChain(undefined);
      activeDrag.setToChain(undefined);
    },
    onDragCancel: () => {
      // Reset the active drag state
      activeDrag.setActiveDragChain(undefined);
      activeDrag.setFromChain(undefined);
      activeDrag.setToChain(undefined);
    },
  });

  return (
    <DragOverlay modifiers={[snapCenterToCursor]}>
      <div className="inline-flex relative">
        <GripVertical className="cursor-grabbing" />
        <div className="absolute left-8 flex items-end gap-2">
          {!isNil(activeDrag.activeDragChain) && isNil(activeDrag.fromChain) && isNil(activeDrag.toChain) && (
            <FancyAvatar
              src={activeDrag.activeDragChain.logoUrl}
              label={activeDrag.activeDragChain.shortName}
              className="shadow-black shadow-md"
            />
          )}
          {!isNil(activeDrag.fromChain) && (
            <div className="inline-flex flex-col gap-1">
              <Label>From</Label>
              <FancyAvatar
                src={activeDrag.fromChain.logoUrl}
                label={activeDrag.fromChain.shortName}
                className="shadow-black shadow-md"
              />
            </div>
          )}
          {!isNil(activeDrag.fromChain) && !isNil(activeDrag.toChain) && (
            <div className="h-10 flex items-center">
              <ArrowRight />
            </div>
          )}
          {!isNil(activeDrag.toChain) && (
            <div className="inline-flex flex-col gap-1">
              <Label>To</Label>
              <FancyAvatar
                src={activeDrag.toChain.logoUrl}
                label={activeDrag.toChain.shortName}
                className="shadow-black shadow-md"
              />
            </div>
          )}
        </div>
      </div>
    </DragOverlay>
  );
});
ChainDragOverlay.displayName = 'ChainDragOverlay';
