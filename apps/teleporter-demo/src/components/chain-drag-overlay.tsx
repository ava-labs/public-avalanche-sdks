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
import { Card, CardContent } from '@/ui/card';

export const ChainDragOverlay = memo(() => {
  const { fromChain, toChain, form, activeDrag, setChainValue } = useBridgeContext();

  useDndMonitor({
    onDragStart: ({ active }) => {
      const activeChain =
        active && isEvmTeleporterDndData(active.data?.current) ? active.data.current.chain : undefined;
      activeChain && activeDrag.setActiveDragChain(activeChain);
    },
    onDragOver: ({ active, over }) => {
      const draggedChain =
        active && isEvmTeleporterDndData(active?.data.current) ? active.data.current.chain : undefined;
      const overChain = over && isEvmTeleporterDndData(over?.data.current) ? over.data.current.chain : undefined;

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
      if (activeDrag.fromChain && activeDrag.toChain) {
        // Dragging over another chain, just set the form values manually
        activeDrag.fromChain && form.setValue('fromChainId', activeDrag.fromChain.chainId);
        activeDrag.toChain && form.setValue('toChainId', activeDrag.toChain.chainId);
      } else {
        // Dragging over a "fromChain" or "toChain" form field, there is a risk of
        // The from and to chains being the same, use `setChainValue` since it
        // is equipped to handle this case.
        activeDrag.fromChain && setChainValue('fromChainId', activeDrag.fromChain);
        activeDrag.toChain && setChainValue('toChainId', activeDrag.toChain);
      }

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
    <DragOverlay
      modifiers={[snapCenterToCursor]}
      dropAnimation={{
        /**
         * Animate the drag overlay to the destination droppable container.
         */
        keyframes: ({ active, droppableContainers, transform }) => {
          // The dragged chain will end up in the "fromChain" form field
          const dropDestinationIsFromChain =
            active &&
            isEvmTeleporterDndData(active?.data.current) &&
            active.data.current.chain.chainId === fromChain?.chainId;
          // The dragged chain will end up in the "toChain" form field
          const dropDestinationIsToChain =
            active &&
            isEvmTeleporterDndData(active?.data.current) &&
            active.data.current.chain.chainId === toChain?.chainId;

          // Get the actual drop destination node
          const dropDestination = dropDestinationIsFromChain
            ? droppableContainers.get(DroppableId.From)
            : dropDestinationIsToChain
            ? droppableContainers.get(DroppableId.To)
            : undefined;

          // Use the node rect to calculate the destination coordinates
          const dropDestinationRect = dropDestination?.rect.current;
          const activeRect = active.rect;
          const finalCoords = dropDestinationRect
            ? {
                // Use Right and Top because the chain fields are on the top-right of the cards
                x: dropDestinationRect.right - activeRect.right,
                y: dropDestinationRect.top - activeRect.top,
              }
            : transform.final;

          // Now that the coordinates have been calculated, trigger the animation
          return [
            {
              transform: `translate(${transform.initial.x}px, ${transform.initial.y}px)`,
              opacity: '100%',
            },
            {
              transform: `translate(${finalCoords.x}px, ${finalCoords.y}px)`,
              opacity: '0%',
            },
          ];
        },
      }}
    >
      <div className="inline-flex relative">
        <GripVertical className="cursor-grabbing" />
        <Card className="absolute left-8 shadow-black shadow-md border bg-card/20 backdrop-blur-md">
          <CardContent className="flex items-end gap-2 py-3 px-6">
            {!isNil(activeDrag.activeDragChain) && isNil(activeDrag.fromChain) && isNil(activeDrag.toChain) && (
              <FancyAvatar
                src={activeDrag.activeDragChain.logoUrl}
                label={activeDrag.activeDragChain.shortName}
              />
            )}
            {!isNil(activeDrag.fromChain) && (
              <div className="inline-flex flex-col gap-1">
                <Label>From</Label>
                <FancyAvatar
                  src={activeDrag.fromChain.logoUrl}
                  label={activeDrag.fromChain.shortName}
                  color={activeDrag.fromChain.primaryColor}
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
                  color={activeDrag.toChain.primaryColor}
                />
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DragOverlay>
  );
});
ChainDragOverlay.displayName = 'ChainDragOverlay';
