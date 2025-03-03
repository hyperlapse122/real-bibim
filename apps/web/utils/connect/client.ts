import 'client-only';
import { atom, useAtomValue } from 'jotai';
import { atomFamily, useHydrateAtoms } from 'jotai/utils';
import type { ReactNode } from 'react';
import { createConnectTransport } from '@connectrpc/connect-web';
import type { DescService } from '@bufbuild/protobuf';
import { type Client, createClient } from '@connectrpc/connect';

const publicStreamServerUrlAtom = atom<string | null>(null);
publicStreamServerUrlAtom.debugLabel = 'publicStreamServerUrlAtom';

const publicStreamTransportAtom = atom((get) => {
  const streamServerUrl = get(publicStreamServerUrlAtom);
  if (!streamServerUrl) {
    throw new Error('PublicStreamServerUrlProvider is not used');
  }
  return createConnectTransport({
    baseUrl: streamServerUrl,
    fetch,
  });
});
publicStreamTransportAtom.debugLabel = 'publicStreamTransportAtom';

const publicStreamClientAtomFamily = atomFamily((service: DescService) => {
  const clientAtom = atom((get) =>
    createClient(service, get(publicStreamTransportAtom)),
  );
  clientAtom.debugLabel = `publicStreamClientAtomFamily(${service.name})`;
  return clientAtom;
});

export function PublicStreamServerUrlProvider({
  publicStreamServerUrl,
  children,
}: {
  children: ReactNode;
  publicStreamServerUrl: string;
}) {
  useHydrateAtoms([[publicStreamServerUrlAtom, publicStreamServerUrl]]);

  return children;
}

export function useTransport() {
  const streamServerUrl = useAtomValue(publicStreamServerUrlAtom);
  if (!streamServerUrl) {
    throw new Error('PublicStreamServerUrlProvider is not used');
  }

  return useAtomValue(publicStreamTransportAtom);
}

export function useClient<T extends DescService>(service: T) {
  return useAtomValue(publicStreamClientAtomFamily(service)) as Client<T>;
}
