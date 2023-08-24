import { NotImplementedError } from '../errors';

type ExecuteBridgeJourneyStepParams = {
  stepIndex: number;
  journey: unknown;
};

export const executeBridgeJourneyStep = async (_params: ExecuteBridgeJourneyStepParams) => {
  /**
   * 1. Validate the journey
   * 3. Forward request along to the right bridge platform's package.
   * 4. Return an observable that emits events when:
   *    - User signs the transaction (returns the fromChain txId)
   *    - Every block confirmation on fromChain
   *    - fromChain tx completed, starting the toChain tx (returns the toChainTxId)
   *    - Every block confirmation on toChain
   *    - toChain tx completed
   */
  throw new NotImplementedError();
};
