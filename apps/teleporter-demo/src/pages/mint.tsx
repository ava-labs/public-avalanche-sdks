import { MintForm } from '@/components/mint-form';
import { WhatsTeleporterSheet } from '@/components/whats-teleporter-sheet';
import { Card, CardContent, CardTitle } from '@/ui/card';
import { memo } from 'react';

export const MintPage = memo(() => {
  return (
    <>
      <Card className="flex grow">
        <CardContent className="w-full max-sm:px-0">
          <CardTitle>
            <span className="ml-6">Mint</span>
          </CardTitle>
          <CardContent>
            <MintForm />
          </CardContent>
        </CardContent>
      </Card>
      <WhatsTeleporterSheet />
    </>
  );
});
