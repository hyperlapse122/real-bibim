'use client';

import { type ReactNode, useMemo } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TRPCProvider } from '@/utils/trpc/contenxt';
import {
  createTRPCClient as createTRPCClientInternal,
  createWSClient,
  httpBatchLink,
  type TRPCLink,
  wsLink,
} from '@trpc/client';
import superjson from 'superjson';
import type { AppRouter } from '@real-bibim/stream/router';
import type { StreamEndpointUrl } from '@/stream/schemas/stream-endpoint-url-schema';

let browserQueryClient: QueryClient | undefined = undefined;

export default function TanStackQueryClientProvider({
  children,
  url,
}: {
  children: ReactNode;
  url: StreamEndpointUrl;
}) {
  const queryClient = getQueryClient();
  const trpcClient = useMemo(
    () =>
      createTRPCClientInternal<AppRouter>({
        links: [getEndingLink(url)],
      }),
    [url],
  );

  return (
    <QueryClientProvider client={queryClient}>
      <TRPCProvider trpcClient={trpcClient} queryClient={queryClient}>
        {children}
      </TRPCProvider>
    </QueryClientProvider>
  );
}

function getEndingLink({
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

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // With SSR, we usually want to set some default staleTime
        // above 0 to avoid refetching immediately on the client
        staleTime: 60 * 1000,
      },
    },
  });
}

function getQueryClient() {
  if (typeof window === 'undefined') {
    // Server: always make a new query client
    return makeQueryClient();
  } else {
    // Browser: make a new query client if we don't already have one
    // This is very important, so we don't re-make a new client if React
    // suspends during the initial render. This may not be needed if we
    // have a suspense boundary BELOW the creation of the query client
    if (!browserQueryClient) browserQueryClient = makeQueryClient();
    return browserQueryClient;
  }
}
