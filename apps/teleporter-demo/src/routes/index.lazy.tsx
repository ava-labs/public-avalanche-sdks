import { TeleporterV2Page } from '@/pages/teleporter/teleporter';
import { createLazyFileRoute } from '@tanstack/react-router';

export const Route = createLazyFileRoute('/')({
  component: () => <TeleporterV2Page />,
});
