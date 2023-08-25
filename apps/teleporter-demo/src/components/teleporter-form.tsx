import { AMPLIFY, BULLETIN, CHAINS } from '@/constants/chains';
import { Button } from '@/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/ui/form';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/ui/select';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { z } from 'zod';

const formSchema = z.object({
  fromChain: z.string(),
  toChain: z.string(),
  address: z.string(),
  amount: z.string(),
});

export const TeleporterForm = () => {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fromChain: String(AMPLIFY.id),
      toChain: String(BULLETIN.id),
      address: '',
      amount: '',
    },
  });

  const onSubmit = (fields: z.infer<typeof formSchema>) => {
    console.log(fields);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8"
      >
        <FormField
          control={form.control}
          name="fromChain"
          render={({ field }) => (
            <FormItem>
              <FormLabel>From</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a subnet" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {CHAINS.map((chain) => (
                      <SelectItem
                        value={String(chain.id)}
                        key={chain.id}
                      >
                        {chain.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormDescription>The source chain.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="toChain"
          render={({ field }) => (
            <FormItem>
              <FormLabel>To</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a fruit" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Subnet</SelectLabel>
                      {CHAINS.map((chain) => (
                        <SelectItem
                          value={String(chain.id)}
                          key={chain.id}
                        >
                          {chain.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormDescription>The source chain.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
};
