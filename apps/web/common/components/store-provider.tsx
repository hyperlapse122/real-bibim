'use client';

import type { ReactNode } from 'react';
import { Provider as StoreProviderInternal } from 'jotai';
import { store } from '../atoms/store';
import { DevTools } from 'jotai-devtools';
import 'jotai-devtools/styles.css';

export default function StoreProvider({ children }: { children: ReactNode }) {
  return (
    <StoreProviderInternal store={store}>
      <DevTools store={store} />
      {children}
    </StoreProviderInternal>
  );
}
