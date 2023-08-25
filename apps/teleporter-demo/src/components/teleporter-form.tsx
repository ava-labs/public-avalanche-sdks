import { Button } from '@/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/ui/form';
import { Input } from '@/ui/input';
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
      fromChain: '',
      toChain: '',
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
                <Input
                  placeholder="Chain A"
                  {...field}
                />
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
                <Input
                  placeholder="Chain B"
                  {...field}
                />
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
