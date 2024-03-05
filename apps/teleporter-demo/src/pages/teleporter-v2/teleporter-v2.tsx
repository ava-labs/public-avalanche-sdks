import { TELEPORTER_CONFIG } from '@/constants/chains';
import { memo } from 'react';
import { cn } from '@/utils/cn';
import { DndContext, pointerWithin } from '@dnd-kit/core';
import { DraggableChainCard } from './components/draggable-chain-card';
import { BridgeProvider } from './providers/bridge-provider';
import { BridgeForm } from './components/bridge-form';
import { ChainDragOverlay } from './components/chain-drag-overlay';

export const TeleporterV2Page = memo(() => {
  return (
    <BridgeProvider>
      <DndContext collisionDetection={pointerWithin}>
        <ChainDragOverlay />
        <div className="flex flex-col gap-4">
          <div className="flex gap-4">
            {TELEPORTER_CONFIG.chains.map((chain) => {
              return (
                <DraggableChainCard
                  chain={chain}
                  className={cn('cursor-grab basis-0 grow')}
                  key={chain.chainId}
                />
              );
            })}
          </div>
          <BridgeForm />
        </div>
      </DndContext>
    </BridgeProvider>
  );
});
TeleporterV2Page.displayName = 'TeleporterV2Page';
