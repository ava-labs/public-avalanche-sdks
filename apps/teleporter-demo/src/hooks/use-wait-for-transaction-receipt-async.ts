import { useConfig } from 'wagmi';
import { waitForTransactionReceipt } from '@wagmi/core';
import type { Hex } from 'viem';

export const useWaitForTransactionReceiptAsync = () => {
  const config = useConfig();
  return {
    waitForTransactionReceipt: ({ hash }: { hash: Hex }) => waitForTransactionReceipt(config, { hash }),
  };
};
