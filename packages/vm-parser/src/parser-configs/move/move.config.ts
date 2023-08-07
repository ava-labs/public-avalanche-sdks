import { UriDestination, type CreateParserConfig } from '@/types/parser-config.js';
import { fetcher } from '@/utils/fetcher.js';
import type { MoveTxDetails } from './types/transaction-details.js';

export const createMoveVmConfig: CreateParserConfig<{
  transactionDetails: (txId: string) => Promise<MoveTxDetails>;
}> = (rpcUrl: string) => {
  const moveVmClient = async <TResponse = unknown>(method: string, params: any[]) => {
    return await fetcher<TResponse>(rpcUrl, {
      method: 'POST',
      headers: {
        'content-type': 'application/json;',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method,
        params,
      }),
    });
  };

  return {
    transactionDetails: {
      getPageData: async (txId) => {
        const { result } = await moveVmClient<{ result: MoveTxDetails }>('getTransactionByHash', [
          {
            data: txId,
          },
        ]);

        return result;
      },
      displayFormat: (tx) => {
        return [
          {
            sectionTitle: 'Transaction Details',
            fields: [
              {
                name: 'Tx Hash',
                description: 'The hash of the transaction.',
                displayValue: tx.data.hash,
                uriDestination: UriDestination.ADDRESS,
                uriValue: tx.data.hash,
              },
            ],
          },
        ];
      },
    },
  };
};
