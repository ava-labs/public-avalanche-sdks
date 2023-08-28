import { TELEPORTER_BRIDGE_ABI } from '@/constants/abis/teleporter-bridge-abi';
import { useAccount, useChainId, useContractWrite, useSwitchNetwork, useContractRead } from 'wagmi';
import { useApprove } from './use-approve';
import { NATIVE_ERC20_ABI } from '@/constants/abis/native-erc-20';
import { isNil } from 'lodash-es';
import type { EvmChain } from '@/types/chain';

export const useTeleport = ({
  fromChain,
  toChain,
  amount,
}: {
  fromChain?: EvmChain;
  toChain?: EvmChain;
  amount?: bigint;
}) => {
  const chainId = String(useChainId());
  const { switchNetworkAsync } = useSwitchNetwork();
  const { address } = useAccount();

  const { refetch: fetchAllowance } = useContractRead({
    address: fromChain?.utilityContracts.demoErc20.address,
    functionName: 'allowance',
    abi: NATIVE_ERC20_ABI,
    args: address && fromChain ? [address, fromChain?.utilityContracts.bridge.address] : undefined,
    enabled: false, // Disable auto-fetch since we fetch manually right before teleporting.
  });

  const { approve } = useApprove({
    chain: fromChain,
    addressToApprove: fromChain?.utilityContracts.bridge.address,
    tokenAddress: fromChain?.utilityContracts.demoErc20.address,
  });

  const { writeAsync } = useContractWrite({
    address: fromChain?.utilityContracts.bridge.address,
    functionName: 'bridgeTokens',
    abi: TELEPORTER_BRIDGE_ABI,
    args:
      fromChain && toChain && address && amount
        ? [
            toChain?.platformChainIdHex,
            toChain?.utilityContracts.bridge.address,
            fromChain?.utilityContracts.demoErc20.address,
            address,
            amount,
            BigInt(0),
            BigInt(0),
          ]
        : undefined,
    maxFeePerGas: BigInt(0),
    maxPriorityFeePerGas: BigInt(0),
    chainId: fromChain ? Number(fromChain.chainId) : undefined,
  });

  return {
    teleportToken: async () => {
      try {
        /**
         * Validate inputs.
         */
        if (!fromChain) {
          throw new Error('Missing source subnet.');
        }
        if (!toChain) {
          throw new Error('Missing destination subnet.');
        }
        if (!amount) {
          throw new Error('Missing amount.');
        }

        /**
         * Switch to the source subnet if not already connected.
         */
        if (!switchNetworkAsync) {
          throw new Error('switchNetworkAsync is undefined.');
        }
        if (chainId !== fromChain.chainId) {
          const chainSwitchRes = await switchNetworkAsync(Number(fromChain.chainId));
          if (String(chainSwitchRes.id) !== fromChain.chainId) {
            throw new Error(`Must be connected to ${fromChain.name}.`);
          }
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
          const approveResponse = await approve();
          console.info('Approve successful.', approveResponse);
          await fetchAllowance();
        }

        /**
         * Teleport tokens.
         */
        if (!writeAsync) {
          throw new Error('writeAsync is undefined.');
        }
        return await writeAsync();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (e: any) {
        console.error(e?.message ?? e);

        return undefined;
      }
    },
  };
};