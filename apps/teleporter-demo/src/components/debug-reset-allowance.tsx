import type { EvmTeleporterChain } from '@/constants/chains';
import { useResetAllowance } from '@/hooks/use-reset-allowance';
import { Button } from '@/ui/button';

export const DebugResetAllowanceButton = ({ chain }: { chain: EvmTeleporterChain }) => {
  const { resetAllownce } = useResetAllowance({
    chain,
    tokenAddress: chain?.contracts.teleportedErc20.address,
    addressToReset: chain?.contracts.bridge.address,
  });

  return (
    <Button
      className="w-full"
      onClick={resetAllownce}
    >
      Reset Allowance
    </Button>
  );
};
