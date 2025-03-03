'use client';

import JotaiProvider from '@/common/components/jotai-provider';
import type { ReactNode } from 'react';
import { PublicStreamServerUrlProvider } from '@/utils/connect/client';
import QueryClientProvider from '@/common/components/query-client-provider';

export default function Providers({
  children,
  publicStreamServerUrl,
}: {
  children: ReactNode;
  publicStreamServerUrl: string;
}) {
  return (
    <JotaiProvider>
      <PublicStreamServerUrlProvider
        publicStreamServerUrl={publicStreamServerUrl}
      >
        <QueryClientProvider>{children}</QueryClientProvider>
      </PublicStreamServerUrlProvider>
    </JotaiProvider>
  );
}
