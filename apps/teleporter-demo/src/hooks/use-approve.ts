import type { EvmTeleporterChain } from '@/constants/chains';
import { toast } from '@/ui/hooks/use-toast';
import { type Address } from 'viem';
import { useWriteContract } from 'wagmi';
import { useWaitForTransactionReceiptAsync } from './use-wait-for-transaction-receipt-async';

const MAXIMUM_ALLOWANCE = BigInt('0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff');

export const useApprove = ({
  chain,
  tokenAddress,
  addressToApprove,
}: {
  chain: EvmTeleporterChain;
  tokenAddress?: Address;
  addressToApprove?: Address;
}) => {
  const { writeContractAsync } = useWriteContract();
  const { waitForTransactionReceipt } = useWaitForTransactionReceiptAsync();

  return {
    approve: async () => {
      try {
        if (!chain) {
          throw new Error('Missing source subnet.');
        }
        if (!tokenAddress) {
          throw new Error('Missing token address.');
        }
        if (!addressToApprove) {
          throw new Error('Missing address to approve.');
        }

        const hash = await writeContractAsync({
          address: tokenAddress,
          functionName: 'approve',
          abi: chain.contracts.teleportedErc20.abi,
          args: [addressToApprove, MAXIMUM_ALLOWANCE],
          chainId: Number(chain?.chainId),
        });
        console.info('Approve pending.', hash);
        await waitForTransactionReceipt({ hash });
        console.info('Approve successful.', hash);
        toast({
          title: 'Success',
          description: `Approval successful!`,
        });
        return hash;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (e: any) {
        console.warn(e?.message ?? e);

        return undefined;
      }
    },
  };
};
