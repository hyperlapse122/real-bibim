'use client';

import type { ReactNode } from 'react';
import { TransportProvider } from '@connectrpc/connect-query';
import {
  QueryClient,
  QueryClientProvider as TanStackQueryClientProvider,
} from '@tanstack/react-query';
import { useTransport } from '@/utils/connect/client';

const queryClient = new QueryClient();

export default function QueryClientProvider({
  children,
}: {
  children: ReactNode;
}) {
  const transport = useTransport();
  return (
    <TransportProvider transport={transport}>
      <TanStackQueryClientProvider client={queryClient}>
        {children}
      </TanStackQueryClientProvider>
    </TransportProvider>
  );
}
