import { FancyAvatar } from '@/components/fancy-avatar';
import { memo } from 'react';
import { useBridgeContext, type BridgeFormValues } from '../providers/bridge-provider';
import { Typography } from '@/ui/typography';
import { TELEPORTER_CONFIG } from '@/constants/chains';
import type { ControllerRenderProps } from 'react-hook-form';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/ui/select';
import { Droppable } from './droppable';
import { Slider } from '@/ui/slider';
import { Input } from '@/ui/input';
import tlpTokenLogo from '@/assets/tlp-token-logo.png';
import { Button, buttonVariants } from '@/ui/button';
import { Card, CardContent } from '@/ui/card';
import { formatStringNumber } from '@/utils/format-string';
import { FlashingUpdate } from '@/components/flashing-update';
import { SwapButton } from './swap-button';
import { TeleportingCard } from './teleporting-card';
import { isNil } from 'lodash-es';
import { cn } from '@/utils/cn';
import { TransactionSuccessOverlay } from './transaction-success-overlay';
import { AutoAnimate } from '@/ui/auto-animate';
import { useAccount, useBalance } from 'wagmi';
import { ExternalLink } from 'lucide-react';
import { useMintTlp } from '@/hooks/use-mint-tlp';
import { ConnectWalletAlert } from '@/components/connect-wallet-alert';
import { SecondaryActionAlert } from '@/components/secondary-action-alert';
import { useErc20Balance } from '@/hooks/use-erc20-balance';
import { LoadingSpinner } from '@/ui/loading-spinner';

export enum DroppableId {
  From = 'from',
  To = 'to',
}

const FIELD_NAME_TO_DROPPABLE_ID_MAP = {
  fromChainId: DroppableId.From,
  toChainId: DroppableId.To,
} as const;

export const BridgeForm = memo(() => {
  const { setChainValue, fromChain, maxErc20Amount, handleBridgeToken, teleporterStatus, transactionReceipt } =
    useBridgeContext();
  const { form } = useBridgeContext();
  const { mintToken, isMinting } = useMintTlp();
  const { formattedErc20Balance, isLoading: isLoadingErc20Balance } = useErc20Balance({ chain: fromChain });

  const { address, isConnected } = useAccount();
  const { data: gasBalance, isLoading: isLoadingGasBalance } = useBalance({
    address,
    chainId: Number(fromChain.chainId),
  });

  // If a user is out of gas for the selected chain, send them to the faucet.
  const isFaucetMode = isConnected && !isLoadingGasBalance && !isNil(gasBalance) && Number(gasBalance?.value) === 0;

  // If the user is out of TLP and has C_Chain selected, we should show the mint button instead of the bridge button
  const isMintMode =
    isConnected &&
    !isLoadingErc20Balance &&
    Number(formattedErc20Balance) === 0 &&
    fromChain.chainId === TELEPORTER_CONFIG.tlpMintChain.chainId;

  const renderChainField = ({
    field,
  }: {
    field:
      | ControllerRenderProps<BridgeFormValues, 'fromChainId'>
      | ControllerRenderProps<BridgeFormValues, 'toChainId'>;
  }) => {
    const chain = TELEPORTER_CONFIG.chains.find((chain) => chain.chainId === field.value);
    if (!chain) {
      throw new Error(`Chain not found for chainId: ${field.value}`);
    }
    return (
      <FormItem className="col-span-12 grid grid-cols-12 gap-2 space-y-0">
        <FormLabel className="col-span-12 sm:col-span-6">{field.name === 'fromChainId' ? 'From' : 'To'}</FormLabel>
        <FormControl>
          <Select
            {...field}
            onValueChange={(value) => {
              const chain = TELEPORTER_CONFIG.chains.find((chain) => chain.chainId === value);
              if (!chain) throw new Error(`Invalid chain ID: ${value}`);
              setChainValue(field.name, chain);
            }}
          >
            <Droppable id={FIELD_NAME_TO_DROPPABLE_ID_MAP[field.name]}>
              <FlashingUpdate flashKeys={[chain]}>
                <SelectTrigger className="h-full col-span-12 sm:col-span-6">
                  <div className="flex items-center gap-2">
                    <FancyAvatar
                      src={chain.logoUrl}
                      label={chain.name}
                      className="w-6 h-6 border-[1.5px]"
                      color={chain.primaryColor}
                    />
                    <Typography size="md">{chain.shortName}</Typography>
                  </div>
                </SelectTrigger>
              </FlashingUpdate>
            </Droppable>
            <SelectContent>
              {TELEPORTER_CONFIG.chains.map((chain) => (
                <SelectItem
                  value={chain.chainId}
                  key={chain.chainId}
                >
                  <div className="flex items-center space-x-2 flex-nowrap p-1">
                    <FancyAvatar
                      src={chain.logoUrl}
                      label={chain.name}
                      className="w-6 h-6 border-[1.5px]"
                      color={chain.primaryColor}
                    />
                    <p>{chain.name}</p>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormControl>
        <FormDescription />
        <FormMessage />
      </FormItem>
    );
  };

  return (
    <Form {...form}>
      <div className="relative">
        <form onSubmit={form.handleSubmit(handleBridgeToken, (errors) => console.error(errors))}>
          <Droppable id={DroppableId.From}>
            <Card className="border-0 bg-neutral-900 rounded-b-none">
              <CardContent className="p-7 max-sm:px-3">
                <div className="grid grid-cols-12 gap-y-4 gap-x-4">
                  <FormField
                    control={form.control}
                    name={'fromChainId'}
                    render={renderChainField}
                  />

                  <div className="col-span-12 grid grid-cols-12 gap-x-4">
                    <Typography
                      size="xs"
                      className="col-span-12 text-muted-foreground text-right pb-1 flex items-baseline justify-end"
                    >
                      Balance:
                      <FlashingUpdate flashKeys={[maxErc20Amount, fromChain]}>
                        <span className="font-mono rounded-md px-1 py-0.5">{formatStringNumber(maxErc20Amount)}</span>
                      </FlashingUpdate>
                      {fromChain.contracts.teleportedErc20.symbol}
                    </Typography>

                    <div className="flex justify-end items-center max-sm:hidden col-span-6">
                      <div className="flex gap-1 items-center h-full pl-2">
                        <FancyAvatar
                          src={tlpTokenLogo}
                          label={fromChain.shortName}
                          className="w-6 h-6 -my-3 text-muted-foreground"
                        />
                        <Typography size="lg">{fromChain.contracts.teleportedErc20.symbol}</Typography>
                      </div>
                    </div>
                    <div className="col-span-12 sm:col-span-6">
                      <FormField
                        control={form.control}
                        name={'erc20Amount'}
                        render={({ field }) => (
                          <FormItem>
                            <div className="relative">
                              <FormControl>
                                <div className="flex h-16">
                                  <Button
                                    className="h-full w-24 text-sm rounded-md rounded-r-none rounded-b-none border-r-0"
                                    variant="outline"
                                    disabled={Number(maxErc20Amount) < 1}
                                    onClick={(e) => {
                                      e.preventDefault();
                                      field.onChange(1);
                                    }}
                                  >
                                    1
                                  </Button>
                                  <Input
                                    type="number"
                                    step={0.01}
                                    {...field}
                                    min={0}
                                    max={Number(maxErc20Amount)}
                                    onChange={(e) => field.onChange(Number(e.target.value))}
                                    className="font-mono text-center col-span-5 px-4 rounded-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                  />

                                  <Button
                                    className="h-full w-24 text-sm  rounded-md rounded-l-none rounded-b-none border-l-0"
                                    variant="outline"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      field.onChange(Number(maxErc20Amount));
                                    }}
                                  >
                                    Max
                                  </Button>
                                </div>
                              </FormControl>
                              <FormControl>
                                <Slider
                                  step={0.01}
                                  defaultValue={[field.value]}
                                  onValueChange={(value) => field.onChange(value[0])}
                                  value={[field.value]}
                                  min={0}
                                  max={Number(maxErc20Amount)}
                                  className="absolute bottom-0 translate-y-full"
                                />
                              </FormControl>
                            </div>
                            <FormMessage />
                            <FormDescription />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Droppable>
          <div className="w-full grid grid-cols-12">
            <div className="col-span-6 sm:col-span-12" />
            <div className="relative col-span-6 sm:col-span-12">
              <SwapButton className="absolute max-sm:left-0 sm:right-28 -translate-y-1/2 -translate-x-1/2" />
            </div>
          </div>
          <Droppable id={DroppableId.To}>
            <Card className="border-0 bg-neutral-800 rounded-t-none">
              <CardContent className="flex flex-col gap-4 p-7 max-sm:px-3">
                <div className="grid grid-cols-12 gap-y-4 gap-x-4">
                  <FormField
                    control={form.control}
                    name={'toChainId'}
                    render={renderChainField}
                  />
                </div>
                <AutoAnimate>
                  {!isConnected ? (
                    <ConnectWalletAlert />
                  ) : isFaucetMode ? (
                    <SecondaryActionAlert
                      title="Out of gas!"
                      description={`Get gas for ${fromChain.name} at the Core Faucet!`}
                    >
                      <a
                        href={fromChain.faucetUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={cn(buttonVariants({ variant: 'default' }), 'inline-flex gap-2 items-center')}
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                      >
                        Go to Faucet
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </SecondaryActionAlert>
                  ) : isMintMode ? (
                    <SecondaryActionAlert
                      title="Out of TLP!"
                      description="You must first mint TLP on the C-Chain before you can use Teleporter."
                    >
                      <Button
                        type="submit"
                        className="w-full"
                        startIcon={isMinting && <LoadingSpinner />}
                        disabled={isMinting}
                        onClick={(e) => {
                          e.preventDefault();
                          mintToken();
                        }}
                      >
                        {isMinting ? 'Minting TLP...' : 'Mint TLP'}
                      </Button>
                    </SecondaryActionAlert>
                  ) : (
                    <Button
                      type="submit"
                      className="w-full animate-background-rotate inline-block bg-white from-primary via-white/30 to-primary bg-[length:_300%_300%] p-0.5 [animation-duration:_5s] bg-gradient-to-r"
                      disabled={
                        form.formState.isSubmitting || isMintMode || isLoadingGasBalance || isLoadingErc20Balance
                      }
                    >
                      <span className="inline-flex rounded-full w-full h-full bg-white hover:bg-white/55 transition-colors duration-500 items-center justify-center">
                        Teleport
                      </span>
                    </Button>
                  )}
                </AutoAnimate>
                {!isNil(form.formState.errors.root?.message) && (
                  <p className={cn('text-[0.8rem] font-medium text-destructive')}>
                    {form.formState.errors.root?.message}
                  </p>
                )}
              </CardContent>
            </Card>
          </Droppable>
        </form>
        {(teleporterStatus === 'approving' || teleporterStatus === 'teleporting') && (
          <div className="absolute w-full h-full top-0 left-0 animate-in fade-in-0 duration-300">
            <TeleportingCard />
          </div>
        )}
        {teleporterStatus === 'complete' && transactionReceipt && (
          <div className="absolute w-full h-full top-0 left-0 animate-in fade-in-0 duration-300">
            <Card className="relative w-full h-full flex bg-card/90 backdrop-blur-md">
              <TransactionSuccessOverlay />
            </Card>
          </div>
        )}
      </div>
      {/* Use this to debug handling allowances */}
      {/* <DebugResetAllowanceButton chain={fromChain} /> */}
    </Form>
  );
});
BridgeForm.displayName = 'BridgeForm';
