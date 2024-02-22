import type { Abi, Address } from 'viem';
import type { Chain as WagmiChain } from 'wagmi';
import { z } from 'zod';

export type EvmChain = z.infer<typeof evmChainSchema>;
export type Erc20Token = z.infer<typeof erc20Token>;

const contract = z.object({
  universalId: z.string(),
  address: z.string().transform((val) => val as Address),
  name: z.string(),
  abi: z.array(z.object({}).passthrough()).transform((abi) => abi as unknown as Abi),
});

const erc20Token = contract.extend({
  name: z.string(),
  symbol: z.string(),
  decimals: z.number(),
});

export const evmChainSchema = z.object({
  platformChainId: z.string(),
  platformChainIdHex: z.string().transform((val) => val as `0x${string}`),
  subnetId: z.string(),
  slug: z.string(),
  explorerUrl: z.string(),
  rpcUrl: z.string(),
  faucetUrl: z.string(),
  isTestnet: z.boolean(),
  logoUrl: z.string(),
  name: z.string(),
  shortName: z.string(),
  networkToken: z.object({
    universalId: z.string(),
    decimals: z.number(),
    name: z.string(),
    symbol: z.string(),
  }),
  primaryColor: z.string(),
  chainId: z.string(),
  contracts: z.object({
    // Token that is mintable. This is optional because this demo only allows minting from C-Chain.
    mintableErc20: erc20Token.optional(),
    // Token that is created upon teleportation
    teleportedErc20: erc20Token,
    // The actual teleporter bridge contract
    bridge: contract,
  }),
  wagmiConfig: z
    .object({})
    .passthrough()
    .transform((wagmiConfig) => wagmiConfig as WagmiChain),
});
