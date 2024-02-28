import type { EvmTeleporterChain } from '@/constants/chains';
import { type CardProps, Card, CardContent } from '@/ui/card';
import { cn } from '@/utils/cn';
import { GripVertical } from 'lucide-react';
import { Suspense, forwardRef, memo } from 'react';
import { FancyAvatar } from '@/components/fancy-avatar';
import tlpTokenLogo from '@/assets/tlp-token-logo.png';
import { useErc20Balance } from '@/hooks/use-erc20-balance';
import { Skeleton } from '@/ui/skeleton';
import { FlashingUpdate } from '../flashing-update';

const BalanceValue = ({ chain }: { chain: EvmTeleporterChain }) => {
  const { formattedErc20Balance } = useErc20Balance({ chain });
  return <FlashingUpdate className="font-mono text-5xl">{formattedErc20Balance}</FlashingUpdate>;
};

export const TokenBalanceCard = memo(
  forwardRef<HTMLDivElement, CardProps & { chain: EvmTeleporterChain }>(
    ({ chain, className, ...rest }: CardProps & { chain: EvmTeleporterChain }, ref) => {
      return (
        <Card
          ref={ref}
          className={cn('relative cursor-grab', className)}
          {...rest}
        >
          <CardContent className="flex flex-col gap-6 pl-12">
            <div className="flex items-center">
              <GripVertical className="absolute left-4" />
              <span className="text-xl font-medium leading-none text-muted-foreground">Balance:</span>
            </div>
            <div className="flex gap-3 items-end">
              <Suspense fallback={<Skeleton className="w-full h-12" />}>
                <BalanceValue chain={chain} />
              </Suspense>
              <div className="flex gap-1 items-center">
                <FancyAvatar
                  src={tlpTokenLogo}
                  label={chain.shortName}
                  className="w-6 h-6 -my-3"
                />
                <span className="text-2xl font-bold text-muted-foreground">TLP</span>
              </div>
            </div>
          </CardContent>
        </Card>
      );
    },
  ),
);
TokenBalanceCard.displayName = 'TokenBalanceCard';
