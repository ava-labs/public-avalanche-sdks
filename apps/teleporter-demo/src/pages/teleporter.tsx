import { ActivityFeed } from '@/components/activity-feed';
import { TeleporterForm } from '@/components/teleporter-form';
import { WhatsTeleporterSheet } from '@/components/whats-teleporter-sheet';
import { Card, CardContent, CardTitle } from '@/ui/card';
import { memo } from 'react';

export const TeleporterPage = memo(() => {
  return (
    <>
      <Card className="flex grow">
        <CardContent className="w-full max-sm:px-0">
          <CardTitle>
            <span className="ml-6">Teleporter</span>
          </CardTitle>
          <CardContent>
            <TeleporterForm />
          </CardContent>
        </CardContent>
      </Card>
      <WhatsTeleporterSheet />
      <ActivityFeed />
    </>
  );
});
