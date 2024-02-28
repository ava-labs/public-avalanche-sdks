import { TELEPORTER_CONFIG, type EvmTeleporterChain } from '@/constants/chains';
import { DragOverlay, type UniqueIdentifier } from '@dnd-kit/core';
import { isNil } from 'lodash-es';
import { memo, useState } from 'react';
import { DndContext } from '@dnd-kit/core';
import { cn } from '@/utils/cn';

import { TokenBalanceCard } from '@/components/drag-and-drop/token-balance-card';
import { ActiveBridgeCard } from '@/components/drag-and-drop/active-bridge-card';
import { DroppableChainColumn } from '@/components/drag-and-drop/droppable-chain-column';
import { Draggable } from '@/components/drag-and-drop/draggable';
import { AutoAnimate } from '@/ui/auto-animate';

export const TeleporterPage = memo(() => {
  const [activelyDraggedChain, setActivelyDraggedChain] = useState<EvmTeleporterChain>();
  const [dropDestinationId, setDropDestinationId] = useState<UniqueIdentifier>();
  const [activeDrop, setActiveDrop] = useState<{ fromChain: EvmTeleporterChain; toChain: EvmTeleporterChain }>();

  return (
    <DndContext
      onDragStart={({ active }) => {
        setActivelyDraggedChain(active.data?.current as EvmTeleporterChain);
      }}
      onDragOver={({ over }) => {
        setDropDestinationId(over?.id);
      }}
      onDragEnd={({ active, over }) => {
        setActivelyDraggedChain(undefined);
        if (!over?.id || active.data?.current === over?.data.current) {
          return;
        }
        setActiveDrop({
          fromChain: active.data?.current as EvmTeleporterChain,
          toChain: over?.data.current as EvmTeleporterChain,
        });
      }}
      onDragCancel={() => setActivelyDraggedChain(undefined)}
    >
      <div className="grid grid-cols-3 w-full divide-x">
        {TELEPORTER_CONFIG.chains.map((chain) => (
          <DroppableChainColumn
            key={chain.chainId}
            chain={chain}
          >
            <div>
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
            </div>
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
      </div>
    </DndContext>
  );
});
