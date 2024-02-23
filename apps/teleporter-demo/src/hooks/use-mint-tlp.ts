import { TELEPORTER_CONFIG } from '@/constants/chains';
import { toast } from '@/ui/hooks/use-toast';
import { useWriteContract, useSimulateContract } from 'wagmi';
import { useWaitForTransactionReceiptAsync } from './use-wait-for-transaction-receipt-async';

export const useMintTlp = () => {
  const { data } = useSimulateContract({
    address: TELEPORTER_CONFIG.tlpMintChain.contracts.mintableErc20.address,
    functionName: 'mint',
    abi: TELEPORTER_CONFIG.tlpMintChain.contracts.mintableErc20.abi,
    args: [BigInt('1000000000000000000')], // Mint amount.  1 TLP
  });
  const { writeContractAsync } = useWriteContract();
  const { waitForTransactionReceipt } = useWaitForTransactionReceiptAsync();

  return {
    mintToken: async () => {
      try {
        if (!data?.request) {
          throw new Error('Unable to simulate mint request.');
        }

        const hash = await writeContractAsync(data.request);
        console.info('Mint pending.', hash);
        await waitForTransactionReceipt({ hash });
        console.info('Mint successful.', hash);
        toast({
          title: 'Success',
          description: `Successfully minted token.`,
        });
        return hash;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (e: any) {
        console.warn(e?.message ?? e);

        toast({
          title: 'Error',
          description: `Mint failed.`,
        });

        return undefined;
      }
    },
  };
};
