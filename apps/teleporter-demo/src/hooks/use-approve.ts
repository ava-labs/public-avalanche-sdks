import { NATIVE_ERC20_ABI } from '@/constants/abis/native-erc-20';
import type { EvmChain } from '@/types/chain';
import { toast } from '@/ui/hooks/use-toast';
import { useChainId, useContractWrite, usePrepareContractWrite, useSwitchNetwork, type Address } from 'wagmi';

export const useApprove = ({
  chain,
  tokenAddress,
  addressToApprove,
  amount,
}: {
  chain?: EvmChain;
  tokenAddress?: Address;
  addressToApprove?: Address;
  amount?: bigint;
}) => {
  const chainId = String(useChainId());
  const { switchNetworkAsync } = useSwitchNetwork();

  const { config } = usePrepareContractWrite({
    address: tokenAddress,
    functionName: 'approve',
    abi: NATIVE_ERC20_ABI,
    args: chain && tokenAddress && addressToApprove && amount ? [addressToApprove, amount] : undefined,
  });

  const { writeAsync } = useContractWrite(config);

  return {
    approve: async () => {
      try {
        if (!switchNetworkAsync) {
          throw new Error('switchNetworkAsync is undefined.');
        }
        if (!chain) {
          throw new Error('Missing source subnet.');
        }

        if (chainId !== chain.chainId) {
          const chainSwitchRes = await switchNetworkAsync(Number(chain.chainId));
          if (String(chainSwitchRes.id) !== chain.chainId) {
            throw new Error(`Must be connected to ${chain.name}.`);
          }
        }

        if (!writeAsync) {
          throw new Error('writeAsync is undefined.');
        }

        const approveResponse = await writeAsync?.();
        console.info('Successfully approved token.', approveResponse);
        toast({
          title: 'Success',
          description: `Approval successful!`,
        });
        return approveResponse;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (e: any) {
        console.warn(e?.message ?? e);

        return undefined;
      }
    },
  };
};
