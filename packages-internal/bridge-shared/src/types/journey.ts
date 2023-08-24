import { BridgePlatform } from './bridge-platform';
import type { EvmChain } from './chain';
import { type NativeToken, type Token } from './token';

export type Journey = {
  steps: JourneyStep[];
};

export type JourneyStep = {
  fromChain: EvmChain;
  toChain: EvmChain;
  bridgePlatform: BridgePlatform.AVALANCHE_BRIDGE;
  amount: bigint;
  totalEstimatedFees: bigint;
  estimatedFees: EstimatedFee[];
};

export enum FeeType {
  PROCESSING_FEE = 'processing-fee',
  NETWORK_FEE = 'network-fee',
}

export type EstimatedFee = {
  feeType: FeeType;
  amount: bigint;
  token: NativeToken;
};

export enum AwardType {
  AIRDROP = 'airdrop',
}

export type Award = {
  awardType: AwardType;
  amount: bigint;
  token: Token;
};
