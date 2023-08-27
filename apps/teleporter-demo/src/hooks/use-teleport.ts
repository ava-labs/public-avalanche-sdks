import type { TeleportForm } from '@/components/teleporter-form';
import { TELEPORTER_BRIDGE_ABI } from '@/constants/abis/teleporter-bridge-abi';
import { AMPLIFY_CHAIN, CHAINS } from '@/constants/chains';
import { toast } from '@/ui/hooks/use-toast';
import { useAccount, useChainId, useContractWrite, usePrepareContractWrite, useSwitchNetwork } from 'wagmi';

export const useTeleport = (form: TeleportForm) => {
  const chainId = String(useChainId());
  const { switchNetworkAsync } = useSwitchNetwork();
  const { address } = useAccount();

  const fromChainId = form.getValues('fromChain');
  const fromChain = CHAINS.find((chain) => chain.chainId === fromChainId);

  const toChainId = form.getValues('toChain');
  const toChain = CHAINS.find((chain) => chain.chainId === toChainId);

  console.info([
    toChain?.platformChainIdHex,
    toChain?.utilityContracts.bridge.address,
    fromChain?.utilityContracts.demoErc20.address,
    address,
    BigInt('100000000000000000'),
    BigInt(0),
    BigInt(0),
  ]);

  const { config } = usePrepareContractWrite({
    address: AMPLIFY_CHAIN.utilityContracts.demoErc20.address,
    functionName: 'bridgeTokens',
    abi: TELEPORTER_BRIDGE_ABI,
    args:
      fromChain && toChain && address
        ? [
            toChain?.platformChainIdHex,
            toChain?.utilityContracts.bridge.address,
            fromChain?.utilityContracts.demoErc20.address,
            address,
            BigInt('100000000000000000'),
            BigInt(0),
            BigInt(0),
          ]
        : undefined,
    // args: [toChain?.utilityContracts.bridge.addressfromChain?.platformChainId, isErc20TokenBalance(token) ? token.address : undefined,  ],
    maxFeePerGas: BigInt(0),
    maxPriorityFeePerGas: BigInt(0),
  });

  const { writeAsync } = useContractWrite(config);

  return {
    teleportToken: async () => {
      try {
        if (!switchNetworkAsync) {
          throw new Error('switchNetworkAsync is undefined.');
        }
        if (!fromChain) {
          throw new Error('Missing source subnet.');
        }
        if (!toChain) {
          throw new Error('Missing destination subnet.');
        }

        if (chainId !== fromChain.chainId) {
          const chainSwitchRes = await switchNetworkAsync(Number(fromChain.chainId));
          if (String(chainSwitchRes.id) !== fromChain.chainId) {
            throw new Error(`Must be connected to ${fromChain.name}.`);
          }
        }

        if (!writeAsync) {
          throw new Error('writeAsync is undefined.');
        }

        const mintResponse = await writeAsync?.();
        console.info('Successfully minted token.', mintResponse);
        toast({
          title: 'Success',
          description: `Teleportation successful!`,
        });
        return mintResponse;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (e: any) {
        console.warn(e?.message ?? e);

        toast({
          title: 'Error',
          description: `Teleportation failed.`,
        });

        return undefined;
      }
    },
  };
};
