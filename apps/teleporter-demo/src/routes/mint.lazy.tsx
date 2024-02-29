import { MintPage } from '@/pages/mint';
import { TabsContent } from '@/ui/tabs';
import { createLazyFileRoute } from '@tanstack/react-router';

export const Route = createLazyFileRoute('/mint')({
  component: () => (
    <TabsContent value="/mint">
      <MintPage />
    </TabsContent>
  ),
});
