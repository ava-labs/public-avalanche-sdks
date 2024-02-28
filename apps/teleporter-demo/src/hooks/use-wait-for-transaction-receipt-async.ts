import { useConfig } from 'wagmi';
import { waitForTransactionReceipt } from '@wagmi/core';
import type { Hex, TransactionReceipt } from 'viem';
import { useState } from 'react';

export const useWaitForTransactionReceiptAsync = () => {
  const config = useConfig();
  const [transactionReceipt, setTransactionReceipt] = useState<TransactionReceipt>();
  return {
    transactionReceipt,
    waitForTransactionReceipt: async ({ hash }: { hash: Hex }) => {
      const transactionReceipt = await waitForTransactionReceipt(config, { hash });
      setTransactionReceipt(transactionReceipt);
      return transactionReceipt;
    },
  };
};
