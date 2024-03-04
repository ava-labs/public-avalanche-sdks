import { TeleporterV2Page } from '@/pages/teleporter-v2/teleporter-v2';
import { createLazyFileRoute } from '@tanstack/react-router';

export const Route = createLazyFileRoute('/')({
  component: () => <TeleporterV2Page />,
});
