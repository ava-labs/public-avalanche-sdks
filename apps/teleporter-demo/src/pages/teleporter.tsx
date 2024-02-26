import { TELEPORTER_CONFIG, type EvmTeleporterChain } from '@/constants/chains';
import { DragOverlay } from '@dnd-kit/core';
import { isNil } from 'lodash-es';
import { memo, useState } from 'react';
import { DndContext } from '@dnd-kit/core';
import { cn } from '@/utils/cn';

import { TokenBalanceCard } from '@/components/drag-and-drop/token-balance-card';
import { ActiveBridgeCard } from '@/components/drag-and-drop/active-bridge-card';
import { DroppableChainColumn } from '@/components/drag-and-drop/droppable-chain-column';
import { Draggable } from '@/components/drag-and-drop/draggable';

export const TeleporterPage = memo(() => {
  const [activelyDraggedChain, setActivelyDraggedChain] = useState<EvmTeleporterChain>();
  const [activeDrop, setActiveDrop] = useState<{ fromChain: EvmTeleporterChain; toChain: EvmTeleporterChain }>();

  return (
    <DndContext
      onDragStart={({ active }) => {
        console.log('active.data?.current', active.data?.current);

        setActivelyDraggedChain(active.data?.current as EvmTeleporterChain);
      }}
      onDragEnd={({ active, over, ...rest }) => {
        console.log('rest', rest);

        setActivelyDraggedChain(undefined);
        if (!over?.id || active.data?.current === over?.data.current) {
          return;
        }
        setActiveDrop({
          fromChain: active.data?.current as EvmTeleporterChain,
          toChain: over?.data.current as EvmTeleporterChain,
        });
        console.log('event', event);
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
                  className={cn(chain === activelyDraggedChain ? 'opacity-50 grayscale' : '')}
                />
              </Draggable>
              {activeDrop && activeDrop.toChain.chainId === chain.chainId && <ActiveBridgeCard {...activeDrop} />}
            </div>
          </DroppableChainColumn>
        ))}
        <DragOverlay>
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
