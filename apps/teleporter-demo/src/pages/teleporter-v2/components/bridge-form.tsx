import { FancyAvatar } from '@/components/fancy-avatar';
import { memo } from 'react';
import { useBridgeContext, type BridgeFormValues } from '../providers/bridge-provider';
import { Typography } from '@/ui/typography';
import { TELEPORTER_CONFIG } from '@/constants/chains';
import { SwapButton } from './swap-button';
import type { ControllerRenderProps } from 'react-hook-form';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  useFormField,
} from '@/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/ui/select';
import { Droppable } from './droppable';
import { Slider } from '@/ui/slider';
import { Input } from '@/ui/input';
import tlpTokenLogo from '@/assets/tlp-token-logo.png';
import { Button } from '@/ui/button';
import { ChevronUp } from 'lucide-react';
import { useErc20Balance } from '@/hooks/use-erc20-balance';

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
      <FormItem className="col-span-5 flex flex-col">
        <FormLabel>{field.name === 'fromChainId' ? 'From' : 'To'}</FormLabel>
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
              <SelectTrigger className="h-auto">
                <div className="flex items-center gap-2 p-4">
                  <FancyAvatar
                    src={chain.logoUrl}
                    label={chain.name}
                  />
                  <Typography size="lg">{chain.shortName}</Typography>
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
    <div className="flex flex-col gap-4">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(
            (data) => console.log(data),
            (errors) => console.error(errors),
          )}
          className="flex flex-col gap-4"
        >
          <div className="grid grid-cols-11 w-full gap-2 items-center relative">
            <FormField
              control={form.control}
              name={'fromChainId'}
              render={renderChainField}
            />
            <SwapButton className="translate-y-2" />
            <FormField
              control={form.control}
              name={'toChainId'}
              render={renderChainField}
            />
          </div>
          <FormField
            control={form.control}
            name={'erc20Amount'}
            render={({ field }) => {
              const { formItemId } = useFormField();
              return (
                <FormItem className="flex flex-col gap-2">
                  <FormLabel>Amount</FormLabel>
                  <FormControl overrideItemId={`${formItemId}-input`}>
                    <div className="grid grid-cols-11 gap-2 items-center">
                      <Input
                        type="number"
                        step={0.01}
                        {...field}
                        min={0}
                        max={Number(maxErc20Amount)}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                        className="font-mono text-right col-span-5 px-4 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      />
                      <div className="flex gap-1 items-center h-full pl-2">
                        <FancyAvatar
                          src={tlpTokenLogo}
                          label={fromChain.shortName}
                          className="w-6 h-6 -my-3 text-muted-foreground"
                        />
                        <Typography size="lg">{fromChain.contracts.teleportedErc20.symbol}</Typography>
                      </div>
                    </div>
                  </FormControl>
                  <FormControl
                    className="col-span-9"
                    overrideItemId={`${formItemId}-slider`}
                  >
                    <div className="flex flex-col gap-4">
                      <Slider
                        step={0.01}
                        defaultValue={[field.value]}
                        onValueChange={(value) => field.onChange(value[0])}
                        value={[field.value]}
                        min={0}
                        max={Number(maxErc20Amount)}
                      />
                      <div className="relative pb-6">
                        <Button
                          variant="ghost"
                          className="absolute top-0 left-1/2 -translate-x-1/2"
                          onClick={() => field.onChange(Number(maxErc20Amount) / 2)}
                        >
                          50%
                          <span className="relative">
                            <ChevronUp className="w-4 h-4 absolute -top-7 right-2" />
                          </span>
                        </Button>
                        <Button
                          variant="ghost"
                          className="absolute top-0 right-0 -mr-4"
                          onClick={() => field.onChange(Number(maxErc20Amount))}
                        >
                          100%
                          <span className="relative">
                            <ChevronUp className="w-4 h-4 absolute -top-7 right-3" />
                          </span>
                        </Button>
                      </div>
                    </div>
                  </FormControl>
                  <FormDescription />
                  <FormMessage />
                </FormItem>
              );
            }}
          />
        </form>
      </Form>
    </div>
  );
});
BridgeForm.displayName = 'BridgeForm';
