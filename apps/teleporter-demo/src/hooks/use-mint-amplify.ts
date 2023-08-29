import { NATIVE_ERC20_ABI } from '@/constants/abis/native-erc-20';
import { AMPLIFY_CHAIN } from '@/constants/chains';
import { toast } from '@/ui/hooks/use-toast';
import { useContractWrite, usePrepareContractWrite, useSwitchNetwork } from 'wagmi';
import { useConnectedChain } from './use-connected-chain';

export const useMintAmplify = () => {
  const { connectedChain } = useConnectedChain();
  const { switchNetworkAsync } = useSwitchNetwork();

  const { config } = usePrepareContractWrite({
    address: AMPLIFY_CHAIN.utilityContracts.demoErc20.address,
    functionName: 'mint',
    abi: NATIVE_ERC20_ABI,
    args: [BigInt('1000000000000000000')],
    maxFeePerGas: BigInt(0),
    maxPriorityFeePerGas: BigInt(0),
  });

  const { writeAsync } = useContractWrite(config);

  return {
    mintToken: async () => {
      try {
        if (!switchNetworkAsync) {
          throw new Error('switchNetworkAsync is undefined.');
        }

        if (connectedChain?.chainId !== AMPLIFY_CHAIN.chainId) {
          const chainSwitchRes = await switchNetworkAsync(Number(AMPLIFY_CHAIN.chainId));
          if (String(chainSwitchRes.id) !== AMPLIFY_CHAIN.chainId) {
            throw new Error(`Can only mint on ${AMPLIFY_CHAIN.name}.`);
          }
        }

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
