import { NotImplementedError } from '../errors';
import { BridgePlatform, type Token } from '@internal/bridge-shared';

type GetBridgeRouterParams = {
  fromChainId: string;
  toChainId: string;
  fromToken: Token;
};

type BridgeTransactionStep = {
  fromChainId: string;
  toChainId: string;
  bridgePlatform: BridgePlatform;
  fromToken: Token;
  toToken: Token;
};

/**
 * Returns a list of transaction steps needed to complete a bridge from chain A to B.
 * The response may include multiple steps if the bridge requires multiple hops.
 */
export const planBridgeJourney = (_params: GetBridgeRouterParams): BridgeTransactionStep[] => {
  // Implement smart logic for determining how to get the token from chain A to B
  throw new NotImplementedError();
};
