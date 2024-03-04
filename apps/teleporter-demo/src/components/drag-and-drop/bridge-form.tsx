import { TELEPORTER_CONFIG, type EvmTeleporterChain } from '@/constants/chains';
import {
  memo,
  type HTMLAttributes,
  type ButtonHTMLAttributes,
  useState,
  type ReactElement,
  type HtmlHTMLAttributes,
} from 'react';
import { useForm, type ControllerRenderProps } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormField, FormItem } from '@/ui/form';
import { Button } from '@/ui/button';
import { FancyAvatar } from '../fancy-avatar';
import { useDndMonitor, useDraggable } from '@dnd-kit/core';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/ui/select';
import { Droppable } from './droppable-chain';
import { ArrowRight, ArrowRightLeft } from 'lucide-react';
import { ChainCard } from './chain-card';
import { DraggableChain } from './draggable-chain';
import { Slot } from '@radix-ui/react-slot';
import { cn } from '@/utils/cn';
import { SwapButton } from './swap-button';

enum DroppableId {
  FromChain = 'fromChainId',
  ToChain = 'toChainId',
}

type FromToChainFieldName = `fromChainId` | `toChainId`;

const FIELD_NAME_TO_DROPPABLE_ID: Record<FromToChainFieldName, DroppableId> = {
  fromChainId: DroppableId.FromChain,
  toChainId: DroppableId.ToChain,
};

const chainIdSchema = z.enum(TELEPORTER_CONFIG.chainIds);

export const BridgeForm = memo(() => {
  const formSchema = z.object({
    fromChainId: z.enum(TELEPORTER_CONFIG.chainIds),
    toChainId: z.enum(TELEPORTER_CONFIG.chainIds),
    erc20Amount: z.preprocess(
      Number,
      z
        .number()
        .min(0, {
          message: `Amount must be greater than zero.`,
        })
        .default(0),
    ),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      erc20Amount: 0,
      fromChainId: TELEPORTER_CONFIG.chains[0].chainId,
      toChainId: TELEPORTER_CONFIG.chains[1].chainId,
    },
  });

  const handleChangeChain = (fieldName: FromToChainFieldName, chainId: (typeof TELEPORTER_CONFIG.chainIds)[number]) => {
    form.setValue(fieldName, chainId);

    const otherFieldName: FromToChainFieldName = fieldName === 'fromChainId' ? 'toChainId' : 'fromChainId';
    const otherChainId = form.getValues(otherFieldName);
    if (chainId === otherChainId) {
      const newChainId = TELEPORTER_CONFIG.chainIds.find((id) => id !== chainId);
      if (!newChainId) throw new Error('No other chain found');
      form.setValue(otherFieldName, newChainId);
    }
  };

  useDndMonitor({
    onDragOver: ({ over: _ }) => {
      // setDropDestinationId(over?.id);
    },
    onDragEnd: ({ active, over }) => {
      const zDraggedChainId = chainIdSchema.safeParse(
        (active.data?.current as EvmTeleporterChain | undefined)?.chainId,
      );
      const zDroppableChainId = chainIdSchema.safeParse(
        (over?.data?.current as EvmTeleporterChain | undefined)?.chainId,
      );

      // Dragged a chain onto another chain
      if (zDraggedChainId.success && zDroppableChainId.success && zDraggedChainId.data !== zDroppableChainId.data) {
        form.setValue('fromChainId', zDraggedChainId.data);
        form.setValue('toChainId', zDroppableChainId.data);
        return;
      }

      // Dragged a chain onto the "fromChainId" field
      if (zDraggedChainId.success && over?.id === DroppableId.FromChain) {
        handleChangeChain('fromChainId', zDraggedChainId.data);
        return;
      }

      // Dragged a chain onto the "toChainId" field
      if (zDraggedChainId.success && over?.id === DroppableId.ToChain) {
        form.setValue('toChainId', zDraggedChainId.data);
        handleChangeChain('toChainId', zDraggedChainId.data);
        return;
      }
    },
  });

  const handleBridgeToken = async (data: z.infer<typeof formSchema>) => {
    console.log('data', data);
  };

  const renderChainField = ({
    field,
  }: {
    field:
      | ControllerRenderProps<z.infer<typeof formSchema>, 'fromChainId'>
      | ControllerRenderProps<z.infer<typeof formSchema>, 'toChainId'>;
  }) => {
    const chain = TELEPORTER_CONFIG.chains.find((chain) => chain.chainId === field.value);
    if (!chain) {
      throw new Error(`Chain not found for chainId: ${field.value}`);
    }
    return (
      <FormItem className="h-full">
        <Select
          {...field}
          onValueChange={(value) => handleChangeChain(field.name, chainIdSchema.parse(value))}
        >
          <Droppable id={FIELD_NAME_TO_DROPPABLE_ID[field.name]}>
            <SelectTrigger className="h-full p-0">
              <ChainCard
                chain={chain}
                className="border-none bg-transparent h-full w-full"
              />
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
    <Form {...form}>
      <form
        className="flex flex-col gap-6"
        onSubmit={form.handleSubmit(handleBridgeToken, (errors) => console.error(errors))}
      >
        <div className="w-full flex gap-2">
          <div className="grow basis-0">
            <FormField
              control={form.control}
              name={'fromChainId'}
              render={renderChainField}
            />
          </div>
          <div className="flex items-center">
            <SwapButton
              onClick={() => {
                const prevFromChainId = form.getValues('fromChainId');
                const prevToChainId = form.getValues('toChainId');
                form.setValue('fromChainId', prevToChainId);
                form.setValue('toChainId', prevFromChainId);
              }}
            />
          </div>
          <div className="grow basis-0">
            <FormField
              control={form.control}
              name={'toChainId'}
              render={renderChainField}
            />
          </div>
        </div>

        <Button className="w-full">Bridge Tokens!</Button>
      </form>
    </Form>
  );
});
BridgeForm.displayName = 'BridgeForm';
