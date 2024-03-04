import { FancyAvatar } from '@/components/fancy-avatar';
import { TELEPORTER_CONFIG, type EvmTeleporterChain } from '@/constants/chains';
import { Card, CardContent, CardHeader, CardTitle } from '@/ui/card';
import { memo, useState } from 'react';
import { cn } from '@/utils/cn';
import { DndContext, DragOverlay, type UniqueIdentifier, pointerWithin } from '@dnd-kit/core';
import { snapCenterToCursor } from '@dnd-kit/modifiers';
import { DraggableChainCard } from './components/draggable-chain-card';
import { isNil } from 'lodash-es';
import { isEvmTeleporterDndData } from './utils/type-guards';
import { BridgeProvider } from './providers/bridge-provider';
import { BridgeForm } from './components/bridge-form';

export const TeleporterV2Page = memo(() => {
  const [activelyDraggedChain, setActivelyDraggedChain] = useState<EvmTeleporterChain>();
  const [_dropDestinationId, setDropDestinationId] = useState<UniqueIdentifier>();

  return (
    <BridgeProvider>
      <DndContext
        collisionDetection={pointerWithin}
        onDragStart={({ active }) => {
          if (isEvmTeleporterDndData(active.data?.current)) {
            setActivelyDraggedChain(active.data.current.chain);
          }
        }}
        onDragOver={({ over }) => {
          setDropDestinationId(over?.id);
        }}
        onDragEnd={({ active, over }) => {
          setActivelyDraggedChain(undefined);
          if (!over?.id || active.data?.current === over?.data.current) {
            return;
          }
        }}
        onDragCancel={() => setActivelyDraggedChain(undefined)}
      >
        <DragOverlay modifiers={[snapCenterToCursor]}>
          {!isNil(activelyDraggedChain) && (
            <FancyAvatar
              src={activelyDraggedChain?.logoUrl}
              label={activelyDraggedChain?.shortName}
              className="cursor-grabbing"
            />
          )}
        </DragOverlay>
        <div className="flex flex-col gap-4">
          <div className="flex gap-4">
            {TELEPORTER_CONFIG.chains.map((chain) => {
              return (
                <DraggableChainCard
                  chain={chain}
                  className={cn('cursor-grab basis-0 grow')}
                />
              );
            })}
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Bridge</CardTitle>
            </CardHeader>
            <CardContent>
              <BridgeForm />
            </CardContent>
          </Card>
        </div>
      </DndContext>
    </BridgeProvider>
  );

  return <span>Hello TeleporterV2Page</span>;
});
TeleporterV2Page.displayName = 'TeleporterV2Page';
