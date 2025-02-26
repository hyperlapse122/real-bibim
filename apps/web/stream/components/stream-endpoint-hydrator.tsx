'use client';

import { type EndpointUrl, endpointUrlAtom } from '../atoms/endpoint-url-atom';
import { useHydrateAtoms } from 'jotai/utils';
import type { ReactNode } from 'react';

export default function StreamEndpointHydrator({
  url,
  children,
}: {
  url: EndpointUrl;
  children: ReactNode;
}) {
  useHydrateAtoms([[endpointUrlAtom, url]]);
  return children;
}
