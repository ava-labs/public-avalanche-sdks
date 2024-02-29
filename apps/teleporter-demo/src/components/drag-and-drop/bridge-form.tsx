import type { EvmTeleporterChain } from '@/constants/chains';
import { Slider } from '@/ui/slider';
import { memo, useMemo, useState, type Dispatch } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useErc20Balance } from '@/hooks/use-erc20-balance';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/ui/form';
import { Input } from '@/ui/input';
import { Button } from '@/ui/button';
import Big from 'big.js';
import { FromToChain } from './from-to-chain';
import { useTeleport } from '@/hooks/use-teleport';
import { AutoAnimate } from '@/ui/auto-animate';
import Rive from '@rive-app/react-canvas';
import teleportingAnimation from '@/assets/teleporting.riv?url';
import { FancyAvatar } from '../fancy-avatar';
import tlpTokenLogo from '@/assets/tlp-token-logo.png';
import type { TransactionReceipt } from 'viem';
import { isNil } from 'lodash-es';
import { Undo2 } from 'lucide-react';
import { useAccount, useBalance } from 'wagmi';
import { TransactionSuccessAlert } from '../transaction-success-alert';

export const BridgeForm = memo(
  ({
    fromChain,
    toChain,
    isTeleporting,
    setIsTeleporting,
  }: {
    fromChain: EvmTeleporterChain;
    toChain: EvmTeleporterChain;
    isTeleporting: boolean;
    setIsTeleporting: Dispatch<boolean>;
  }) => {
    /**
     * ERC-20 Balances
     */
    const { formattedErc20Balance: fromChainFormattedErc20Balance, refetch: refetchFromChainErc20Balance } =
      useErc20Balance({ chain: fromChain });
    const { refetch: refetchToChainErc20Balance } = useErc20Balance({ chain: toChain });

    /**
     * Gas Balance
     */
    const { address } = useAccount();
    const { refetch: refetchFromChainGasBalance } = useBalance({
      address,
      chainId: Number(fromChain.chainId),
    });

    const formSchema = z.object({
      erc20Amount: z.preprocess(
        Number,
        z
          .number()
          .min(0, {
            message: `Amount must be greater than zero.`,
          })
          .max(Number(fromChainFormattedErc20Balance), {
            message: `Amount must not exceed the current balance of ${fromChainFormattedErc20Balance} ${fromChain.contracts.teleportedErc20.symbol}`,
          })
          .default(0),
      ),
    });

    const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: {
        erc20Amount: Math.min(Number(fromChainFormattedErc20Balance), 1),
      },
    });

    const erc20Amount = Number(form.watch('erc20Amount'));
    const { teleportToken } = useTeleport({
      fromChain,
      toChain,
      amount: useMemo(
        () => BigInt(new Big(erc20Amount).mul(10 ** fromChain.contracts.teleportedErc20.decimals).toString()),
        [erc20Amount],
      ),
    });
    const [transactionReceipt, setTransactionReceipt] = useState<TransactionReceipt>();

    const handleBridgeToken = async (_data: z.infer<typeof formSchema>) => {
      setIsTeleporting(true);
      const transactionReceipt = await teleportToken();
      refetchFromChainErc20Balance();
      refetchFromChainGasBalance();

      // There currently isn't any way to detect transaction confirmation on the toChain,
      // so just refetch balances after a short delay.
      setTimeout(() => {
        refetchToChainErc20Balance();
      }, 5000);

      setTransactionReceipt(transactionReceipt);
      setIsTeleporting(false);
    };

    if (isTeleporting || !isNil(transactionReceipt)) {
      return (
        <div className="flex flex-col gap-6">
          <FromToChain
            fromChain={fromChain}
            toChain={toChain}
          />
          {isTeleporting ? (
            <div className="relative">
              <div className="flex gap-3 items-end justify-center py-5">
                <span className="font-mono text-3xl">{erc20Amount}</span>
                <div className="flex gap-1 items-center">
                  <FancyAvatar
                    src={tlpTokenLogo}
                    label={'TLP'}
                    className="w-6 h-6 -my-3"
                  />
                  <span className="text-2xl font-bold text-muted-foreground">TLP</span>
                </div>
              </div>
              <Rive
                className="h-72 w-[calc(100%+10rem)] absolute -bottom-[100px] -left-[5rem]"
                src={teleportingAnimation}
              />
            </div>
          ) : (
            <AutoAnimate>
              {transactionReceipt && (
                <div className="flex flex-col items-start gap-6">
                  <TransactionSuccessAlert
                    explorerBaseUrl={fromChain.explorerUrl}
                    txHash={transactionReceipt.transactionHash}
                    actionLabel="Bridge"
                  />
                  <Button
                    onClick={() => setTransactionReceipt(undefined)}
                    className="w-full"
                    variant="secondary"
                    endIcon={<Undo2 />}
                  >
                    Reset
                  </Button>
                </div>
              )}
            </AutoAnimate>
          )}
        </div>
      );
    }

    return (
      <Form {...form}>
        <form
          className="flex flex-col gap-6"
          onSubmit={form.handleSubmit(handleBridgeToken, (errors) => console.error(errors))}
        >
          <FromToChain
            fromChain={fromChain}
            toChain={toChain}
          />
          <FormField
            control={form.control}
            name="erc20Amount"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-2">
                <div className="flex justify-between items-baseline">
                  <FormLabel className="flex grow">Amount</FormLabel>
                  <FormControl className="max-w-40">
                    <div className="flex gap-2 items-center">
                      <Input
                        type="number"
                        step={0.01}
                        min={0}
                        max={Number(fromChainFormattedErc20Balance)}
                        {...field}
                      />
                      <div className="flex gap-1 items-center h-full pointer-events-none">
                        <FancyAvatar
                          src={tlpTokenLogo}
                          label={fromChain.shortName}
                          className="w-4 h-4 -my-3"
                        />
                        <span className="text-lg font-bold text-muted-foreground">TLP</span>
                      </div>
                    </div>
                  </FormControl>
                </div>
                <FormControl className="col-span-9">
                  <Slider
                    max={Number(fromChainFormattedErc20Balance)}
                    step={0.01}
                    defaultValue={[field.value]}
                    onValueChange={(value) => field.onChange(value[0])}
                    value={[field.value]}
                  />
                </FormControl>
                <FormDescription />
                <FormMessage />
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
