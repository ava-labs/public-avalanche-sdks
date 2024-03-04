import { DragOverlay, useDndMonitor, type UniqueIdentifier, type Over } from '@dnd-kit/core';
import { memo, useState } from 'react';
import { snapCenterToCursor } from '@dnd-kit/modifiers';
import type { EvmTeleporterChain } from '@/constants/chains';
import { isNil } from 'lodash-es';
import { ArrowRight, GripVertical } from 'lucide-react';
import { FancyAvatar } from '../fancy-avatar';
import { AutoAnimate } from '@/ui/auto-animate';
import { Card, CardContent } from '@/ui/card';
import { Label } from '@/ui/label';

export const BridgeDragOverlay = memo(() => {
  const [activelyDraggedChain, setActivelyDraggedChain] = useState<EvmTeleporterChain>();
  const [dropDestination, setDropDestination] = useState<Over>();

  const dropDestinationChain = dropDestination?.data?.current as EvmTeleporterChain;

  useDndMonitor({
    onDragStart: ({ active }) => {
      setActivelyDraggedChain(active.data?.current as EvmTeleporterChain);
    },
    onDragOver: ({ over }) => {
      setDropDestination(over ?? undefined);
    },
    onDragEnd: () => {
      setActivelyDraggedChain(undefined);
    },
    onDragCancel: () => setActivelyDraggedChain(undefined),
  });

  return (
    <DragOverlay
      modifiers={[snapCenterToCursor]}
      dropAnimation={{
        // Instead of returning overlay to its initial position, we return it to the position of the actively dragged chain
        keyframes: ({ active, droppableContainers, transform }) => {
          const dropDestinationRect = droppableContainers
            ?.get(dropDestination?.id)
            ?.node?.current?.getBoundingClientRect();

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
        <div className="inline-flex relative">
          <GripVertical className="cursor-grabbing" />
          <Card className="absolute left-[100%]">
            <CardContent className="flex items-end gap-2">
              <table>
                <tr>
                  <th className="text-start">
                    <Label>From</Label>
                  </th>
                  {dropDestinationChain && dropDestinationChain.chainId !== activelyDraggedChain.chainId && (
                    <>
                      <th />
                      <th>
                        <Label>To</Label>
                      </th>
                    </>
                  )}
                </tr>
                <tr>
                  <td>
                    <FancyAvatar
                      src={activelyDraggedChain.logoUrl}
                      label={activelyDraggedChain.name}
                      className="w-12 h-12"
                    />
                  </td>
                  {dropDestinationChain && dropDestinationChain.chainId !== activelyDraggedChain.chainId && (
                    <>
                      <td>
                        <ArrowRight />
                      </td>
                      <td>
                        <FancyAvatar
                          src={dropDestinationChain.logoUrl}
                          label={dropDestinationChain.name}
                          className="w-12 h-12"
                        />
                      </td>
                    </>
                  )}
                </tr>
              </table>
            </CardContent>
          </Card>
        </div>
      )}
    </DragOverlay>
  );
});
