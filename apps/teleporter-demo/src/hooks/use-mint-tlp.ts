import { TELEPORTER_CONFIG } from '@/constants/chains';
import { toast } from '@/ui/hooks/use-toast';
import { useWriteContract, useSimulateContract } from 'wagmi';

export const useMintTlp = () => {
  const { data } = useSimulateContract({
    address: TELEPORTER_CONFIG.tlpMintChain.contracts.mintableErc20.address,
    functionName: 'mint',
    abi: TELEPORTER_CONFIG.tlpMintChain.contracts.mintableErc20.abi,
    args: [BigInt('1000000000000000000')], // Mint amount.  1 TLP
  });

  const { writeContractAsync } = useWriteContract();

  return {
    mintToken: async () => {
      try {
        if (!data?.request) {
          throw new Error('Unable to simulate mint request.');
        }

        const mintResponse = await writeContractAsync(data.request);
        console.info('Successfully minted token.', mintResponse);
        toast({
          title: 'Success',
          description: `Successfully minted token.`,
        });
        return mintResponse;
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
