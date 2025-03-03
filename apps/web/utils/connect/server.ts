import 'server-only';

import { unstable_noStore } from 'next/cache';
import { createConnectTransport } from '@connectrpc/connect-web';
import { type Client, createClient, type Transport } from '@connectrpc/connect';
import type { DescService } from '@bufbuild/protobuf';

function getTransport(): Transport {
  unstable_noStore();

  const streamServerUrl = process.env.STREAM_SERVER_URL;
  if (!streamServerUrl) throw new Error('STREAM_SERVER_URL is not defined');

  return createConnectTransport({
    baseUrl: streamServerUrl,
    fetch,
  });
}

export function getClient<T extends DescService>(service: T): Client<T> {
  return createClient<T>(service, getTransport());
}
