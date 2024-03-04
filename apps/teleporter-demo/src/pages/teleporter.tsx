import { TELEPORTER_CONFIG, type EvmTeleporterChain } from '@/constants/chains';
import { DragOverlay, type UniqueIdentifier } from '@dnd-kit/core';
import { isNil } from 'lodash-es';
import { memo, useState } from 'react';
import { DndContext, pointerWithin } from '@dnd-kit/core';
import { snapCenterToCursor, restrictToVerticalAxis, restrictToHorizontalAxis } from '@dnd-kit/modifiers';

import { DraggableChain } from '@/components/drag-and-drop/draggable-chain';
import { ChainCard } from '@/components/drag-and-drop/chain-card';
import { DroppableChain } from '@/components/drag-and-drop/droppable-chain';
import { BridgeForm } from '@/components/drag-and-drop/bridge-form';
import { Card, CardContent } from '@/ui/card';
import { FancyAvatar } from '@/components/fancy-avatar';
import { ArrowRight, GripIcon, GripVertical } from 'lucide-react';
import { BridgeDragOverlay } from '@/components/drag-and-drop/bridge-drag-overlay';

export const TeleporterPage = memo(() => {
  const [activelyDraggedChain, setActivelyDraggedChain] = useState<EvmTeleporterChain>();
  const [dropDestinationId, setDropDestinationId] = useState<UniqueIdentifier>();

  return (
    <DndContext
      collisionDetection={pointerWithin}
      onDragStart={({ active }) => {
        setActivelyDraggedChain(active.data?.current as EvmTeleporterChain);
      }}
      onDragOver={({ over }) => {
        setDropDestinationId(over?.id);
      }}
      onDragEnd={() => {
        setActivelyDraggedChain(undefined);
      }}
      onDragCancel={() => setActivelyDraggedChain(undefined)}
    >
      <div>
        <BridgeDragOverlay />
        <div className="grid flex-col gap-4">
          <Card className="bg-transparent">
            <CardContent>
              <div className="grid grid-cols-3 w-full justify-center gap-4">
                {TELEPORTER_CONFIG.chains.map((chain) => (
                  <DraggableChain
                    key={chain.chainId}
                    chain={chain}
                  >
                    <div className="grow">
                      <DroppableChain chain={chain}>
                        <ChainCard
                          chain={chain}
                          draggable
                          className="h-full"
                        />
                      </DroppableChain>
                    </div>
                  </DraggableChain>
                ))}
              </div>
            </CardContent>
          </Card>
          <Card className="flex w-full justify-center">
            <CardContent className="w-full">
              <BridgeForm />
            </CardContent>
          </Card>
        </div>
      </div>
      {/* <div className="grid grid-cols-3 w-full divide-x">
        {TELEPORTER_CONFIG.chains.map((chain) => (
          <DroppableChainColumn
            key={chain.chainId}
            chain={chain}
          >
            <Draggable chain={chain}>
              <TokenBalanceCard
                chain={chain}
                className={cn(
                  'transition-opacity duration-300 ease-in-out',
                  chain === activelyDraggedChain ? '!opacity-50 grayscale' : '!opacity-100',
                )}
              />
            </Draggable>
            <AutoAnimate>
              {activeDrop && activeDrop.toChain.chainId === chain.chainId && <ActiveBridgeCard {...activeDrop} />}
            </AutoAnimate>
          </DroppableChainColumn>
        ))}
        <DragOverlay
          dropAnimation={{
            // Instead of returning overlay to its initial position, we return it to the position of the actively dragged chain
            keyframes: ({ active, droppableContainers, transform }) => {
              const dropDestination = droppableContainers.get(dropDestinationId);

              const dropDestinationRect = dropDestination?.node.current?.getBoundingClientRect();
              const activeRect = active.node.getBoundingClientRect();
              const finalCoords = dropDestinationRect
                ? {
                    x: dropDestinationRect.left - activeRect.left + 12,
                    y: dropDestinationRect.top - activeRect.top + 200,
                  }
                : transform.final;

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
          {!isNil(activelyDraggedChain) && (
            <TokenBalanceCard
              chain={activelyDraggedChain}
              className={'cursor-grabbing'}
            />
          )}
        </DragOverlay>
      </div> */}
    </DndContext>
  );
});
