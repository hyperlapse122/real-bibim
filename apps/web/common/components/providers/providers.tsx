'use client';

import JotaiProvider from '@/common/components/providers/jotai-provider';
import type { ReactNode } from 'react';
import { PublicStreamServerUrlProvider } from '@/utils/connect/client';
import QueryClientProvider from '@/common/components/providers/query-client-provider';
import ThemeProvider from './theme-provider';

export default function Providers({
  children,
  publicStreamServerUrl,
}: {
  children: ReactNode;
  publicStreamServerUrl: string;
}) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <JotaiProvider>
        <PublicStreamServerUrlProvider
          publicStreamServerUrl={publicStreamServerUrl}
        >
          <QueryClientProvider>{children}</QueryClientProvider>
        </PublicStreamServerUrlProvider>
      </JotaiProvider>
    </ThemeProvider>
  );
}
