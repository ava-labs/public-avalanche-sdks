import { TeleporterPage } from '@/pages/teleporter';
import { TabsContent } from '@/ui/tabs';
import { createLazyFileRoute } from '@tanstack/react-router';

export const Route = createLazyFileRoute('/')({
  component: () => (
    <TabsContent value="/">
      <TeleporterPage />
    </TabsContent>
  ),
});
