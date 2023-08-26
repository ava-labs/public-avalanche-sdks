import { z } from 'zod';

export type EvmChain = z.infer<typeof evmChainSchema>;

export const evmChainSchema = z.object({
  slug: z.string(),
  explorerUrl: z.string(),
  rpcUrl: z.string(),
  isTestnet: z.boolean(),
  logoUrl: z.string(),
  name: z.string(),
  networkToken: z.object({
    decimals: z.number(),
    name: z.string(),
    symbol: z.string(),
  }),
  primaryColor: z.string(),
  chainId: z.string(),
});
