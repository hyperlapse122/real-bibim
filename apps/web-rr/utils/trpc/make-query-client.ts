import {
  defaultShouldDehydrateQuery,
  QueryClient,
} from '@tanstack/react-query';
import superjson from 'superjson';
import type { StreamEndpointUrl } from '@/stream/schemas/stream-endpoint-url-schema';
import {
  createWSClient,
  httpBatchLink,
  type TRPCLink,
  wsLink,
} from '@trpc/client';
import type { AppRouter } from '@real-bibim/stream/router';

export function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // With SSR, we usually want to set some default staleTime
        // above 0 to avoid refetching immediately on the client
        staleTime: 60 * 1000,
      },
      dehydrate: {
        serializeData: superjson.serialize,
        shouldDehydrateQuery: (query) =>
          defaultShouldDehydrateQuery(query) ||
          query.state.status === 'pending',
      },
      hydrate: {
        deserializeData: superjson.deserialize,
      },
    },
  });
}

export function getEndingLink({
  httpUrl,
  wsUrl,
}: StreamEndpointUrl): TRPCLink<AppRouter> {
  if (typeof window === 'undefined') {
    return httpBatchLink({
      /**
       * @see https://trpc.io/docs/v11/data-transformers
       */
      transformer: superjson,
      url: httpUrl,
      headers() {
        return {};
      },
    });
  }
  const client = createWSClient({
    url: wsUrl,
  });
  return wsLink({
    client,
    /**
     * @see https://trpc.io/docs/v11/data-transformers
     */
    transformer: superjson,
  });
}
