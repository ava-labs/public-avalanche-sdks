import { TELEPORTER_CONFIG, type EvmTeleporterChain } from '@/constants/chains';
import { evmChainSchema } from '@/types/chain';
import { isObject } from 'lodash-es';

export const isEvmTeleporterChain = (chain: unknown): chain is EvmTeleporterChain => {
  const zChain = evmChainSchema.safeParse(chain);
  return zChain.success && TELEPORTER_CONFIG.chains.some((chain) => chain.chainId === zChain.data.chainId);
};

export const isEvmTeleporterDndData = (data: unknown): data is { chain: EvmTeleporterChain } =>
  isObject(data) && 'chain' in data && isEvmTeleporterChain(data.chain);
