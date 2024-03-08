import { Card } from '@/ui/card';
import { memo } from 'react';
import teleportingAnimation from '@/assets/teleporting.riv?url';
import Rive from '@rive-app/react-canvas';
import { useBridgeContext } from '../providers/bridge-provider';
import { FancyAvatar } from '@/components/fancy-avatar';
import tlpTokenLogo from '@/assets/tlp-token-logo.png';
import { Label } from '@/ui/label';
import { Typography } from '@/ui/typography';

export const TeleportingCard = memo(() => {
  const { fromChain, toChain, form } = useBridgeContext();

  const erc20Amount = form.getValues('erc20Amount');
  return (
    <Card className="relative w-full h-full flex justify-center items-center bg-card/90 backdrop-blur-md">
      <div className="absolute w-full h-full flex items-center justify-center">
        <div className="flex gap-4 items-center animate-pulse">
          <span className="font-mono text-3xl font-semibold">{erc20Amount}</span>
          <div className="flex gap-1 items-center">
            <FancyAvatar
              src={tlpTokenLogo}
              label={fromChain.contracts.teleportedErc20.name}
              className="w-8 h-8 -my-3"
            />
            <span className="text-3xl font-bold text-muted-foreground">
              {fromChain.contracts.teleportedErc20.symbol}
            </span>
          </div>
        </div>
      </div>
      {/** translate to offset due to asymmetrical rive animation */}
      <div className="absolute w-full h-full flex items-center justify-center -translate-y-2">
        <Rive
          src={teleportingAnimation}
          style={{ height: '312px' }}
        />
      </div>
      <div className="absolute w-full h-full flex items-center justify-between px-6">
        <div className="flex flex-col items-center w-32">
          <Label className="pb-4 text-muted-foreground">From</Label>
          <FancyAvatar
            src={fromChain.logoUrl}
            label={fromChain.name}
            className="h-14 w-14 relative"
          />
          <Typography className="pt-2 text-center">{fromChain.name}</Typography>
        </div>
        <div className="flex flex-col items-center w-32">
          <Label className="pb-4 text-muted-foreground">To</Label>
          <FancyAvatar
            src={toChain.logoUrl}
            label={toChain.name}
            className="h-14 w-14 relative"
          />
          <Typography className="pt-2 text-center">{toChain.name}</Typography>
        </div>
      </div>
    </Card>
  );
});
TeleportingCard.displayName = 'TeleportingCard';
