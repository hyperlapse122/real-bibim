'use client';

import { createStore, Provider } from 'jotai';
import type { ReactNode } from 'react';
import 'jotai-devtools/styles.css';
import dynamic from 'next/dynamic';

const DevTools = dynamic(
  async () => (await import('jotai-devtools')).DevTools,
  {
    ssr: false,
  },
);

const store = createStore();

export default function JotaiProvider({ children }: { children: ReactNode }) {
  return (
    <Provider store={store}>
      <DevTools store={store} />
      {children}
    </Provider>
  );
}
