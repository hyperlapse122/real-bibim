'use client';

import { type ReactNode, useMemo } from 'react';
import { type QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TRPCProvider } from '@/utils/trpc/client';
import { createTRPCClient as createTRPCClientInternal } from '@trpc/client';
import type { AppRouter } from '@real-bibim/stream/router';
import type { StreamEndpointUrl } from '@/stream/schemas/stream-endpoint-url-schema';
import { getEndingLink, makeQueryClient } from '@/utils/trpc/make-query-client';

let browserQueryClient: QueryClient;

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

export function getQueryClient() {
  if (typeof window === 'undefined') {
    // Server: always make a new query client
    return makeQueryClient();
  }
  // Browser: make a new query client if we don't already have one
  // This is very important, so we don't re-make a new client if React
  // suspends during the initial render. This may not be needed if we
  // have a suspense boundary BELOW the creation of the query client
  if (!browserQueryClient) browserQueryClient = makeQueryClient();
  return browserQueryClient;
}
