'use client';

import type { ReactNode } from 'react';
import { Provider as StoreProviderInternal } from 'jotai';
import { DevTools } from 'jotai-devtools';
import { createStore } from 'jotai/index';

import 'jotai-devtools/styles.css';

export const store = createStore();

export default function JotaiStoreProvider({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <StoreProviderInternal store={store}>
      <DevTools store={store} />
      {children}
    </StoreProviderInternal>
  );
}
