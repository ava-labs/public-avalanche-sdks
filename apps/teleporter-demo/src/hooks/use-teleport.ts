import { TELEPORTER_BRIDGE_ABI } from '@/constants/abis/teleporter-bridge.abi';
import { useAccount, useContractWrite, useContractRead } from 'wagmi';
import { useApprove } from './use-approve';
import { isNil } from 'lodash-es';
import { useLatestTeleporterTransactions } from './use-transactions';
import type { EvmTeleporterChain } from '@/constants/chains';

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

  const { refetch: fetchAllowance } = useContractRead({
    address: fromChain?.contracts.teleportedErc20.address,
    functionName: 'allowance',
    abi: fromChain?.contracts.teleportedErc20.abi,
    args: address && fromChain ? [address, fromChain?.contracts.bridge.address] : undefined,
    enabled: false, // Disable auto-fetch since we fetch manually right before teleporting.
    chainId: Number(fromChain.chainId),
  });

  const { approve } = useApprove({
    chain: fromChain,
    addressToApprove: fromChain?.contracts.bridge.address,
    tokenAddress: fromChain?.contracts.teleportedErc20.address,
  });

  const { writeAsync } = useContractWrite({
    address: fromChain?.contracts.bridge.address,
    functionName: 'bridgeTokens',
    abi: TELEPORTER_BRIDGE_ABI,
    args:
      fromChain && toChain && address && amount
        ? [
            toChain?.platformChainIdHex,
            toChain?.contracts.bridge.address,
            fromChain?.contracts.teleportedErc20.address,
            address,
            amount,
            BigInt(0),
            BigInt(0),
          ]
        : undefined,
    chainId: fromChain ? Number(fromChain.chainId) : undefined,
  });

  return {
    teleportToken: async () => {
      try {
        /**
         * Validate inputs.
         */
        if (!amount) {
          throw new Error('Missing amount.');
        }

        /**
         * Get approval if allowance is insuffient.
         */
        const { data: currentAllowance, refetch: fetchAllowanceAgain } = await fetchAllowance();
        if (isNil(currentAllowance)) {
          throw new Error('Unable to detect current allowance.');
        }

        const hasSufficientAllowance = amount < currentAllowance;
        if (!hasSufficientAllowance) {
          const approveResponse = await approve();
          console.info('Approve successful.', approveResponse);
          await fetchAllowanceAgain();
        }

        /**
         * Teleport tokens.
         */
        if (!writeAsync) {
          throw new Error('writeAsync is undefined.');
        }
        setTimeout(refetchTxs, 3000); // Wait since glacier is behind the RPC by a few seconds
        return await writeAsync();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (e: any) {
        console.error(e?.message ?? e);

        return undefined;
      }
    },
  };
};
