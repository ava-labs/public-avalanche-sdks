import type { EvmTeleporterChain } from '@/constants/chains';
import { Slider } from '@/ui/slider';
import { memo, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useErc20Balance } from '@/hooks/use-erc20-balance';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/ui/form';
import { Input } from '@/ui/input';
import { Button } from '@/ui/button';
import Big from 'big.js';
import { FromToChain } from './from-to-chain';
import { useTeleport } from '@/hooks/use-teleport';

const formSchema = z.object({
  erc20Amount: z.number(),
});

export const BridgeForm = memo(
  ({ fromChain, toChain }: { fromChain: EvmTeleporterChain; toChain: EvmTeleporterChain }) => {
    const { formattedErc20Balance } = useErc20Balance({
      chain: fromChain,
    });

    const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: {
        erc20Amount: Number(formattedErc20Balance) / 2,
      },
    });

    const erc20Amount = form.watch('erc20Amount');
    const { teleportToken } = useTeleport({
      fromChain,
      toChain,
      amount: useMemo(
        () => BigInt(new Big(erc20Amount).mul(10 ** fromChain.contracts.teleportedErc20.decimals).toString()),
        [erc20Amount],
      ),
    });

    const handleBridgeToken = async () => {
      await teleportToken();
    };

    return (
      <Form {...form}>
        <form
          className="flex flex-col gap-6"
          onSubmit={form.handleSubmit(handleBridgeToken)}
        >
          <FromToChain
            fromChain={fromChain}
            toChain={toChain}
          />
          <FormField
            control={form.control}
            name="erc20Amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Amount</FormLabel>
                <div className="grid grid-cols-12 gap-2">
                  <FormControl className="col-span-3">
                    <Input {...field} />
                  </FormControl>
                  <FormControl className="col-span-9">
                    <Slider
                      min={0}
                      max={Number(formattedErc20Balance)}
                      step={1}
                      defaultValue={[field.value]}
                      onValueChange={field.onChange}
                      value={[field.value]}
                    />
                  </FormControl>
                </div>
              </FormItem>
            )}
          />
          <Button className="w-full">Bridge Tokens!</Button>
        </form>
      </Form>
    );
  },
);
BridgeForm.displayName = 'BridgeForm';
