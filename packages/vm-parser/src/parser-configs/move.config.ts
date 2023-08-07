import type { CreateParserConfig } from '@/types/parser-config.js';

export const createMoveVmConfig: CreateParserConfig = (rpcBaseUrl: string) => ({
  getTransactionDetails: async (txId: string) => {
    const baseTxDetails: any = fetch(`${rpcBaseUrl}/v1/tx/${txId}`).then((res) => res.json());

    return {
      txId: baseTxDetails.txId as string,
      blockHash: baseTxDetails.blockHash as string,
    };
  },
});
