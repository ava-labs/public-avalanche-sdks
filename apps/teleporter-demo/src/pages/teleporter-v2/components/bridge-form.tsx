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
import { Button } from '@/ui/button';
import { Card, CardContent } from '@/ui/card';
import { formatStringNumber } from '@/utils/format-string';

export enum DroppableId {
  From = 'from',
  To = 'to',
}

const FIELD_NAME_TO_DROPPABLE_ID_MAP = {
  fromChainId: DroppableId.From,
  toChainId: DroppableId.To,
} as const;

export const BridgeForm = memo(() => {
  const { setChainValue, fromChain, maxErc20Amount } = useBridgeContext();
  const { form } = useBridgeContext();

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
        <FormLabel className="col-span-6">{field.name === 'fromChainId' ? 'From' : 'To'}</FormLabel>
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
              <SelectTrigger className="h-full col-span-6">
                <div className="flex items-center gap-2">
                  <FancyAvatar
                    src={chain.logoUrl}
                    label={chain.name}
                    className="w-6 h-6"
                  />
                  <Typography size="md">{chain.shortName}</Typography>
                </div>
              </SelectTrigger>
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
                      className="w-6 h-6"
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
      <form>
        <Droppable id={FIELD_NAME_TO_DROPPABLE_ID_MAP['fromChainId']}>
          <Card className="border-0 bg-neutral-900 rounded-b-none">
            <CardContent>
              <div className="grid grid-cols-12 gap-y-4 gap-x-4">
                <FormField
                  control={form.control}
                  name={'fromChainId'}
                  render={renderChainField}
                />

                <div className="col-span-12 grid grid-cols-12 gap-x-4">
                  <Typography
                    size="xs"
                    className="col-span-12 text-muted-foreground text-right pb-1"
                  >
                    Balance: {formatStringNumber(maxErc20Amount)} {fromChain.contracts.teleportedErc20.symbol}
                  </Typography>
                  <div className="flex justify-end items-center col-span-3 sm:col-span-6">
                    <div className="flex gap-1 items-center h-full pl-2">
                      <FancyAvatar
                        src={tlpTokenLogo}
                        label={fromChain.shortName}
                        className="w-6 h-6 -my-3 text-muted-foreground"
                      />
                      <Typography size="lg">{fromChain.contracts.teleportedErc20.symbol}</Typography>
                    </div>
                  </div>
                  <div className="col-span-9 sm:col-span-6">
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
        <Droppable id={FIELD_NAME_TO_DROPPABLE_ID_MAP['toChainId']}>
          <Card className="border-0 bg-neutral-800 rounded-t-none">
            <CardContent>
              <div className="grid grid-cols-12 gap-y-4 gap-x-4">
                <FormField
                  control={form.control}
                  name={'toChainId'}
                  render={renderChainField}
                />
              </div>
            </CardContent>
          </Card>
        </Droppable>
        {/* Use this to debug handling allowances */}
        {/* <DebugResetAllowanceButton chain={fromChain} /> */}
      </form>
    </Form>
  );
});
BridgeForm.displayName = 'BridgeForm';
