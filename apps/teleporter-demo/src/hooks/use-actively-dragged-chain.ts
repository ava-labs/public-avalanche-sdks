import { useDndContext } from '@dnd-kit/core';
import { isEvmTeleporterDndData } from '../utils/type-guards';

export const useActivelyDraggedChain = () => {
  const { active } = useDndContext();
  const activeChain = active && isEvmTeleporterDndData(active?.data.current) ? active.data.current.chain : undefined;

  return activeChain;
};
