import { CHAIN, CHAINS } from '@/constants/chains';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/ui/form';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/ui/select';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { z } from 'zod';
import { FancyAvatar } from './token-avatar';
import { SwapButton } from './swap-button';
import { memo, useState } from 'react';
import { LoadingButton } from './loading-button';
import { useBalances } from '@/providers/balances-provider';
import { ScrollArea } from '@/ui/scroll-area';
import { useAccount } from 'wagmi';
import { CardContent } from '@/ui/card';
import { ConnectWalletButton } from './connect-wallet-button';

const formSchema = z.object({
  fromChain: z.string(),
  toChain: z.string(),
  token: z.string(),
  amount: z.string(),
});

export const TeleporterForm = memo(() => {
  const { isConnected } = useAccount();
  const { tokens } = useBalances();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fromChain: String(CHAIN.AMPLIFY.wagmi.id),
      toChain: String(CHAIN.BULLETIN.wagmi.id),
      token: '',
      amount: '',
    },
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = (fields: z.infer<typeof formSchema>) => {
    console.log(fields);

    setIsSubmitting(true);
    setTimeout(() => setIsSubmitting(false), 2000);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8"
      >
        <div className="grid grid-cols-12 gap-4">
          <FormField
            control={form.control}
            name="fromChain"
            render={({ field }) => (
              <FormItem className="md:col-span-5 col-span-12">
                <FormLabel>From</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={isSubmitting}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a subnet" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {CHAINS.map((chain) => (
                        <SelectItem
                          value={chain.chainId}
                          key={chain.chainId}
                        >
                          <div className="flex items-center space-x-2 flex-nowrap">
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
                <FormDescription>The source chain</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="md:col-span-2 col-span-12 flex justify-center">
            <SwapButton
              type="button"
              disabled={isSubmitting}
              className="md:mt-8 max-md:rotate-90"
            />
          </div>
          <FormField
            control={form.control}
            name="toChain"
            render={({ field }) => (
              <FormItem className="md:col-span-5 col-span-12">
                <FormLabel>To</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={isSubmitting}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a subnet" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {CHAINS.map((chain) => (
                        <SelectItem
                          value={chain.chainId}
                          key={chain.chainId}
                        >
                          <div className="flex items-center space-x-2 flex-nowrap">
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
                <FormDescription>The destination chain</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="token"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Token</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={isSubmitting}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a fruit" />
                  </SelectTrigger>
                  <SelectContent>
                    <ScrollArea className="max-h-72">
                      <SelectGroup>
                        {isConnected ? (
                          tokens?.map((token) => {
                            return (
                              <SelectItem
                                value={token.universalTokenId}
                                key={token.universalTokenId}
                                className="h-12 rounded-lg"
                              >
                                <div className="flex items-center space-x-2 flex-nowrap">
                                  <FancyAvatar
                                    src={token.logoUri}
                                    label={token.symbol}
                                    className="w-6 h-6"
                                  />
                                  <p>{token.name}</p>
                                </div>
                              </SelectItem>
                            );
                          })
                        ) : (
                          <CardContent className="flex flex-col items-center space-y-3">
                            <p className="text-gray-300 text-center text-sm">Must connect wallet to view your tokens</p>
                            <ConnectWalletButton
                              variant="secondary"
                              className="w-full"
                            />
                          </CardContent>
                        )}
                      </SelectGroup>
                    </ScrollArea>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormDescription>The destination chain.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <LoadingButton
          type="submit"
          className="uppercase w-full"
          isLoading={isSubmitting}
        >
          teleport!
        </LoadingButton>
      </form>
    </Form>
  );
});
