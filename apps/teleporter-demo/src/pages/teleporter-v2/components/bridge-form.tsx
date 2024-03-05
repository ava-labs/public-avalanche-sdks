import { FancyAvatar } from '@/components/fancy-avatar';
import { memo } from 'react';
import { useBridgeContext, type BridgeFormValues } from '../providers/bridge-provider';
import { Typography } from '@/ui/typography';
import { TELEPORTER_CONFIG } from '@/constants/chains';
import { SwapButton } from './swap-button';
import type { ControllerRenderProps } from 'react-hook-form';
import { FormField, FormItem } from '@/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/ui/select';
import { Droppable } from './droppable';

export enum DroppableId {
  From = 'from',
  To = 'to',
}

const FIELD_NAME_TO_DROPPABLE_ID_MAP = {
  fromChainId: DroppableId.From,
  toChainId: DroppableId.To,
} as const;

export const BridgeForm = memo(() => {
  const { setChainValue } = useBridgeContext();
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
      <FormItem className="flex basis-0 grow">
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
      </FormItem>
    );
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2 items-center">
        <FormField
          control={form.control}
          name={'fromChainId'}
          render={renderChainField}
        />
        <SwapButton />
        <FormField
          control={form.control}
          name={'toChainId'}
          render={renderChainField}
        />
      </div>
    </div>
  );
});
BridgeForm.displayName = 'BridgeForm';
