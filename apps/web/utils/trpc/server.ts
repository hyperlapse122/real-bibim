import type { AppRouter } from '@real-bibim/stream/router';
import {
  createTRPCClient as createTRPCClientInternal,
  httpBatchLink,
  type TRPCClient,
} from '@trpc/client';
import { z } from 'zod';
import superjson from 'superjson';
import { makeQueryClient } from '@/utils/trpc/make-query-client';
import { cache } from 'react';
import {
  createTRPCContext,
  createTRPCOptionsProxy,
} from '@trpc/tanstack-react-query';

const urlSchema = z.string().url();

export const getQueryClient = cache(makeQueryClient);
export const getTrpcClient = cache(createTRPCClient);

export const getTrpc = cache(createProxy);

function createProxy() {
  return createTRPCOptionsProxy({
    ctx: createTRPCContext,
    client: getTrpcClient(),
    queryClient: getQueryClient,
  });
}

function createTRPCClient(): TRPCClient<AppRouter> {
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
