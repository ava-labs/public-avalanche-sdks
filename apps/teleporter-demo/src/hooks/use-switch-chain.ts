import { useSwitchChain as useWagmiSwitchChain } from 'wagmi';
import { toast } from '@/ui/hooks/use-toast';
import { useState } from 'react';

const USER_REJECTS_APPROVAL_POPUP_CODE = 4001;
// const CHAIN_NOT_ADDED_CODE = 4902;

export const useSwitchChain = () => {
  const [dismissToast, setDismissToast] = useState<() => unknown>();

  return useWagmiSwitchChain({
    mutation: {
      onSuccess: ({ name }) => {
        dismissToast?.();
        const { dismiss } = toast({
          title: 'Success',
          description: `Connected to ${name}.`,
        });
        setDismissToast(dismiss);
      },
      onMutate: ({ chainId }) => {
        dismissToast?.();
        const { dismiss } = toast({
          title: 'Switching Networks',
          description: `Switching to ${chainId}.`,
        });
        setDismissToast(dismiss);
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onError: async (error: any) => {
        dismissToast?.();
        if (error?.code === USER_REJECTS_APPROVAL_POPUP_CODE) {
          const { dismiss } = toast({
            title: 'User rejected network switch.',
          });
          setDismissToast(dismiss);
          return;
        }

        const { dismiss } = toast({
          title: 'Unable to Switch Networks',
          description: `Please try again.`,
          variant: 'destructive',
        });
        setDismissToast(dismiss);
      },
    },
  });
};
