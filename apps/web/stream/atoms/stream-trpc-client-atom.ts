import { atom } from 'jotai';
import {
  createTRPCClient as createTRPCClientInternal,
  createWSClient,
  httpBatchLink,
  type TRPCLink,
  wsLink,
} from '@trpc/client';
import { type EndpointUrl, endpointUrlAtom } from './endpoint-url-atom';
import superjson from 'superjson';
import type { AppRouter } from '@real-bibim/stream/router';

export const streamTrpcClientAtom = atom((get) => {
  const link = getEndingLink(get(endpointUrlAtom));

  return createTRPCClientInternal<AppRouter>({
    links: [link],
  });
});
streamTrpcClientAtom.debugLabel = 'streamTrpcClientAtom';

function getEndingLink({ httpUrl, wsUrl }: EndpointUrl): TRPCLink<AppRouter> {
  if (typeof window === 'undefined') {
    return httpBatchLink({
      /**
       * @see https://trpc.io/docs/v11/data-transformers
       */
      transformer: superjson,
      url: httpUrl,
      headers() {
        return {};
      },
    });
  }
  const client = createWSClient({
    url: wsUrl,
  });
  return wsLink({
    client,
    /**
     * @see https://trpc.io/docs/v11/data-transformers
     */
    transformer: superjson,
  });
}
