import type { Address } from 'viem';
import { NotImplementedError } from '../errors';

/**
 * Checks for any currently pending bridge transactions.  Useful for dApps that want
 * to display the current tx's status after a page refresh.
 */
export const checkForPendingBridgeJourney = async ({
  address: _address,
  chainIds: _chainIds,
}: {
  address: Address;
  chainIds: string[];
}) => {
  /**
   * 1. If wallet is Core, request current bridge journey.  Otherwise, check glacier to see if the provided wallet has bridge tx in the past 100 transactions on the provided chains.
   * 3. Returns an array of txIds for all pending transactions
   */
  throw new NotImplementedError();
};
