import { TELEPORTER_CONFIG } from '@/constants/chains';
import { toast } from '@/ui/hooks/use-toast';
import { useWriteContract, useSimulateContract, useAccount, useBalance } from 'wagmi';
import { useWaitForTransactionReceiptAsync } from './use-wait-for-transaction-receipt-async';
import { useErc20Balance } from './use-erc20-balance';
import { useState } from 'react';
import { useSwitchChain } from './use-switch-chain';

export const useMintTlp = () => {
  const { data } = useSimulateContract({
    address: TELEPORTER_CONFIG.tlpMintChain.contracts.mintableErc20.address,
    functionName: 'mint',
    abi: TELEPORTER_CONFIG.tlpMintChain.contracts.mintableErc20.abi,
    args: [BigInt('1000000000000000000')], // Mint amount.  1 TLP
  });
  const { writeContractAsync } = useWriteContract();
  const { waitForTransactionReceipt } = useWaitForTransactionReceiptAsync();
  const { address } = useAccount();
  const { refetch: refetchGasBalance } = useBalance({
    address,
    chainId: Number(TELEPORTER_CONFIG.tlpMintChain.chainId),
  });
  const { refetch: refetchTlpBalance } = useErc20Balance({
    chain: TELEPORTER_CONFIG.tlpMintChain,
  });
  const { switchChainAsync } = useSwitchChain();

  const [isMinting, setIsMinting] = useState(false);

  return {
    isMinting,
    mintToken: async () => {
      setIsMinting(true);
      try {
        await switchChainAsync(TELEPORTER_CONFIG.tlpMintChain);
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
        refetchGasBalance();
        refetchTlpBalance();
        setIsMinting(false);
        return hash;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (e: any) {
        setIsMinting(false);
        console.warn(e?.message ?? e);

        toast({
          title: 'Error',
          description: `Mint failed.`,
          variant: 'destructive',
        });

        return undefined;
      }
    },
  };
};
