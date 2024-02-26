import { TeleporterPage } from '@/pages/teleporter';
import { createLazyFileRoute } from '@tanstack/react-router';

export const Route = createLazyFileRoute('/')({
  component: () => <TeleporterPage />,
});
