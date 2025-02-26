'use client';

import { type EndpointUrl, endpointUrlAtom } from '../atoms/endpoint-url-atom';
import { useHydrateAtoms } from 'jotai/utils';

export default function StreamEndpointHydrator({ url }: { url: EndpointUrl }) {
  useHydrateAtoms([[endpointUrlAtom, url]]);
  return <></>;
}
