import { TELEPORTER_BRIDGE_ABI } from '@/constants/abis/teleporter-bridge.abi';
import { useAccount, useWriteContract, useReadContract } from 'wagmi';
import { useApprove } from './use-approve';
import { isNil } from 'lodash-es';
import { useLatestTeleporterTransactions } from './use-transactions';
import type { EvmTeleporterChain } from '@/constants/chains';
import { useWaitForTransactionReceiptAsync } from './use-wait-for-transaction-receipt-async';

export const useTeleport = ({
  fromChain,
  toChain,
  amount,
}: {
  fromChain: EvmTeleporterChain;
  toChain: EvmTeleporterChain;
  amount?: bigint;
}) => {
  const { address } = useAccount();

  const { mutate: refetchTxs } = useLatestTeleporterTransactions();

  const { refetch: fetchAllowance } = useReadContract({
    address: fromChain?.contracts.teleportedErc20.address,
    functionName: 'allowance',
    abi: fromChain?.contracts.teleportedErc20.abi,
    args: address && fromChain ? [address, fromChain?.contracts.bridge.address] : undefined,
    chainId: Number(fromChain.chainId),
    query: {
      enabled: false, // Disable auto-fetch since we fetch manually right before teleporting.
    },
  });

  const { approve } = useApprove({
    chain: fromChain,
    addressToApprove: fromChain?.contracts.bridge.address,
    tokenAddress: fromChain?.contracts.teleportedErc20.address,
  });

  const { writeContractAsync } = useWriteContract({});
  const { transactionReceipt, waitForTransactionReceipt } = useWaitForTransactionReceiptAsync();

  const teleportToken = async () => {
    try {
      /**
       * Validate inputs.
       */
      if (!address) {
        throw new Error('Missing address.');
      }
      if (!amount) {
        throw new Error('Missing amount.');
      }

      /**
       * Get approval if allowance is insuffient.
       */
      const { data: currentAllowance } = await fetchAllowance();
      if (isNil(currentAllowance)) {
        throw new Error('Unable to detect current allowance.');
      }

      const hasSufficientAllowance = amount < currentAllowance;
      if (!hasSufficientAllowance) {
        await approve();
        await fetchAllowance();
      }

      /**
       * Teleport tokens.
       */
      setTimeout(refetchTxs, 3000); // Wait since glacier is behind the RPC by a few seconds
      const hash = await writeContractAsync({
        address: fromChain.contracts.bridge.address,
        functionName: 'bridgeTokens',
        abi: TELEPORTER_BRIDGE_ABI,
        args: [
          toChain.platformChainIdHex,
          toChain.contracts.bridge.address,
          fromChain.contracts.teleportedErc20.address,
          address,
          amount,
          BigInt(0),
          BigInt(0),
        ],
        chainId: Number(fromChain.chainId),
      });
      console.info('Bridge pending.', hash);
      const transactionReceipt = await waitForTransactionReceipt({ hash });
      console.info('Bridge successful.', hash, transactionReceipt);
      return transactionReceipt;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      console.error(e?.message ?? e);

      return undefined;
    }
  };

  return {
    transactionReceipt,
    teleportToken,
  };
};
