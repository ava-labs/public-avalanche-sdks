import { TeleporterV2Page } from '@/pages/teleporter';
import { createLazyFileRoute } from '@tanstack/react-router';

export const Route = createLazyFileRoute('/')({
  component: () => <TeleporterV2Page />,
});
