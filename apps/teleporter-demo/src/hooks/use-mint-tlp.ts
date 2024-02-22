import { TELEPORTER_CONFIG } from '@/constants/chains';
import { toast } from '@/ui/hooks/use-toast';
import { useContractWrite, usePrepareContractWrite } from 'wagmi';

export const useMintTlp = () => {
  const { config } = usePrepareContractWrite({
    address: TELEPORTER_CONFIG.tlpMintChain.contracts.mintableErc20.address,
    functionName: 'mint',
    abi: TELEPORTER_CONFIG.tlpMintChain.contracts.mintableErc20.abi,
    args: [BigInt('1000000000000000000')], // Mint amount.  1 TLP
  });

  const { writeAsync } = useContractWrite(config);

  return {
    mintToken: async () => {
      try {
        if (!writeAsync) {
          throw new Error('writeAsync is undefined.');
        }

        const mintResponse = await writeAsync?.();
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
