import { glacierService } from '@/constants';
import { TELEPORTER_CONFIG, type EvmTeleporterChain } from '@/constants/chains';
import { NULL_ADDRESS } from '@/constants/token';
import { isFullfilled } from '@/utils/is-fullfilled';
import type { Erc20Transfer } from '@internal/glacier';
import { compact, sortBy } from 'lodash-es';
import useSWR from 'swr';
import { type Address } from 'viem';
import { useAccount } from 'wagmi';

type Erc20TransferWithChain = Erc20Transfer & { chain: EvmTeleporterChain };

const TRANSACTION_COUNT = 10;

export const isExportTx = (tx: Erc20TransferWithChain, walletAddress: Address) =>
  tx.from.address === walletAddress && // from wallet
  (tx.to.address === tx.chain?.contracts.bridge.address || tx.to.address === NULL_ADDRESS); // to bridge

export const isImportTx = (tx: Erc20TransferWithChain, walletAddress: Address) =>
  (tx.chain?.contracts.bridge.address || tx.from.address === NULL_ADDRESS) && // from bridge
  tx.to.address === walletAddress; // to wallet

const getLatestTeleporterTransactions = async ({ address }: { address: Address }) => {
  const settledResponses = await Promise.allSettled(
    TELEPORTER_CONFIG.chains.map((chain) => {
      return glacierService.evmTransactions.listErc20Transactions({
        address,
        chainId: chain.chainId,
        pageSize: TRANSACTION_COUNT,
      });
    }),
  );

  const unsortedTxs = compact(
    settledResponses.flatMap((response, i) => {
      const chain = TELEPORTER_CONFIG.chains[i];

      if (chain && isFullfilled(response)) {
        return response.value.transactions.map((tx) => {
          return {
            ...tx,
            chain: chain,
          };
        });
      }

      return undefined;
    }),
  );

  const teleporterTxs = unsortedTxs.filter((tx) => {
    return isExportTx(tx, address) || isImportTx(tx, address);
  });
  const txsSortedByTimestamp = sortBy(teleporterTxs, ({ blockTimestamp }) => -blockTimestamp).slice(
    0,
    TRANSACTION_COUNT,
  );
  return txsSortedByTimestamp;
};

export const useLatestTeleporterTransactions = () => {
  const { address } = useAccount();
  return useSWR(
    address ? [{ address }, 'getLatestTeleporterTransactions'] : null,
    async ([{ address }]) => {
      return getLatestTeleporterTransactions({
        address,
      });
    },
    {
      refreshInterval: 10000,
    },
  );
};
