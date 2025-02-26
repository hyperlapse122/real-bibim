import type { AppRouter } from '@real-bibim/stream/router';
import {
  createTRPCClient as createTRPCClientInternal,
  httpBatchLink,
  type TRPCClient,
} from '@trpc/client';
import { z } from 'zod';
import superjson from 'superjson';

const urlSchema = z.string().url();

export function createTRPCClient(): TRPCClient<AppRouter> {
  const { success, data } = urlSchema.safeParse(process.env.STREAM_TRPC_URL);
  if (!success) throw new Error('Invalid TRPC URL');

  return createTRPCClientInternal<AppRouter>({
    links: [
      httpBatchLink({
        fetch,
        url: data,
        // You can pass any HTTP headers you wish here
        async headers() {
          return {};
        },
        transformer: superjson,
      }),
    ],
  });
}
