import { executeBridgeJourneyStep } from './handlers/execute-bridge-journey-step';
import { planBridgeJourney } from './handlers/plan-bridge-journey';

import type { Environment, MaybePromise, NativeToken } from '@internal/bridge-shared';
import { checkForPendingBridgeJourney } from './handlers/check-for-pending-bridge-journey';

export type BridgeServiceConfig = {
  environment: `${Environment}`;
  getChainNativeAsset: ({ evmChainId }: { evmChainId: string }) => MaybePromise<NativeToken>;
  getChainErc20Asset: ({ evmChainId, address }: { evmChainId: string; address: string }) => MaybePromise<NativeToken>;
};

export const createUnifiedBridgeService = (_options: BridgeServiceConfig) => {
  return {
    planBridgeJourney,
    executeBridgeJourneyStep,
    checkForPendingBridgeJourney,
  };
};
