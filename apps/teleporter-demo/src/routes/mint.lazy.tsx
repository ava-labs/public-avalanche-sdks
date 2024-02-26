import { MintPage } from '@/pages/mint';
import { createLazyFileRoute } from '@tanstack/react-router';

export const Route = createLazyFileRoute('/mint')({
  component: () => <MintPage />,
});
