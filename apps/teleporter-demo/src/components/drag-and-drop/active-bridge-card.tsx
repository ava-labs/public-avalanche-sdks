import type { EvmTeleporterChain } from '@/constants/chains';
import { Card, CardHeader, CardTitle } from '@/ui/card';
import { memo } from 'react';

export const ActiveBridgeCard = memo(
  ({ fromChain, toChain }: { fromChain: EvmTeleporterChain; toChain: EvmTeleporterChain }) => {
    return (
      <Card>
        <CardHeader>
          <CardTitle>From: {fromChain.shortName}</CardTitle>
          <CardTitle>To: {toChain.shortName}</CardTitle>
        </CardHeader>
      </Card>
    );
  },
);
ActiveBridgeCard.displayName = 'ActiveBridgeCard';
