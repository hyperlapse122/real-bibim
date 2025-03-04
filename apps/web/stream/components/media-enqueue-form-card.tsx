'use client';

import { mediaEnqueue } from '@/stream/actions/media-enqueue';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/common/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/common/components/ui/form';
import { useCallback, useTransition } from 'react';
import { Button } from '@/common/components/ui/button';
import { Input } from '@/common/components/ui/input';
import { LoaderCircle, Plus } from 'lucide-react';

const mediaEnqueueSchema = z.object({
  channelId: z.string(),
  url: z.string().url(),
});
export type MediaEnqueue = z.infer<typeof mediaEnqueueSchema>;

export type MediaEnqueueFormCardProps = {
  mediaEnqueueAction: typeof mediaEnqueue;
  defaultValues?: Partial<MediaEnqueue> & Pick<MediaEnqueue, 'channelId'>;
};

export default function MediaEnqueueFormCard({
  defaultValues,
}: MediaEnqueueFormCardProps) {
  const [isPending, startTransition] = useTransition();
  const form = useForm<MediaEnqueue>({
    resolver: zodResolver(mediaEnqueueSchema),
    defaultValues: {
      url: '',
      ...defaultValues,
    },
  });

  const onSubmit = useCallback(({ channelId, url }: MediaEnqueue) => {
    startTransition(async () => {
      await mediaEnqueue({
        channelId,
        mediaUrl: url,
      });
    });
  }, []);

  return (
    <Card>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardHeader>
            <CardTitle>Enqueue Items</CardTitle>
            <CardDescription>Enqueue items to a channel.</CardDescription>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="shadcn" {...field} />
                  </FormControl>
                  <FormDescription>
                    This is your public display name.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button type="submit">
              {isPending ? <LoaderCircle className="animate-spin" /> : <Plus />}
              <span>Enqueue</span>
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
