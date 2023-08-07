import { UriDestination, type CreateParserConfig, DataDisplayFormat } from '@/types/parser-config';
import { fetcher } from '@/utils/fetcher';
import { MoveTxStatus, type MoveTxDetails } from './types/transaction-details';

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
                displayFormat: DataDisplayFormat.HASH,
                uriValue: tx.data.hash,
                uriDestination: UriDestination.TRANSACTION_HASH,
              },
              {
                name: 'From',
                description: 'The sender of the transaction.',
                displayValue: tx.data.sender,
                displayFormat: DataDisplayFormat.HASH,
                uriValue: tx.data.sender,
                uriDestination: UriDestination.ADDRESS,
              },
              {
                name: 'Status',
                description: 'Whether the transaction succeeded or failed.',
                displayValue: tx.data.vm_status === MoveTxStatus.SUCCESS ? true : false,
                displayFormat: DataDisplayFormat.BOOLEAN_SUCCESS_FAILURE,
              },
            ],
          },
        ];
      },
    },
  };
};
