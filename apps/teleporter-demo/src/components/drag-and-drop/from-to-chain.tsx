import type { EvmTeleporterChain } from '@/constants/chains';
import { memo } from 'react';
import { FancyAvatar } from '../fancy-avatar';
import { Label } from '@/ui/label';

export const FromToChain = memo(
  ({ fromChain, toChain }: { fromChain: EvmTeleporterChain; toChain: EvmTeleporterChain }) => {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>From</Label>
          <div className="flex items-center gap-2">
            <FancyAvatar
              src={fromChain.logoUrl}
              label={fromChain.shortName}
              className="w-8 h-8"
            />
            <span>{fromChain.shortName}</span>
          </div>
        </div>
        <div className="space-y-2">
          <Label>To</Label>
          <div className="flex items-center gap-2">
            <FancyAvatar
              src={toChain.logoUrl}
              label={toChain.shortName}
              className="w-8 h-8"
            />

            <span>{toChain.shortName}</span>
          </div>
        </div>
      </div>
    );
  },
);
FromToChain.displayName = 'FromToChain';
