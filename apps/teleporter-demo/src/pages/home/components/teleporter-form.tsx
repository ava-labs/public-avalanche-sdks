import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { zodResolver } from '@hookform/resolvers/zod';

const teleporterFormSchema = z.object({
  fromChain: z.string().nonempty(),
  toChain: z.string().nonempty(),
});

export const TeleporterForm = () => {
  const form = useForm({
    resolver: zodResolver(teleporterFormSchema),
    defaultValues: {
      fromChain: '',
      toChain: '',
    },
  });

  const onSubmit = (values: z.infer<typeof teleporterFormSchema>) => {
    console.log(values);
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
              <FormLabel>From Chain</FormLabel>
              <FormControl>
                <Input
                  placeholder="shadcn"
                  {...field}
                />
              </FormControl>
              <FormDescription>This is your public display name.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};
