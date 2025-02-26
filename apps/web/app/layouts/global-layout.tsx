import { Outlet } from 'react-router';
import type { Route } from './+types/global-layout';
import * as process from 'node:process';
import { z } from 'zod';
import StreamEndpointHydrator from '../../stream/components/stream-endpoint-hydrator';
import type { EndpointUrl } from '../../stream/atoms/endpoint-url-atom';
import StoreProvider from '../../common/components/store-provider';

const urlSchema = z.string().url();

export async function loader({}: Route.LoaderArgs) {
  const trpcHttpUrl = urlSchema.parse(process.env.PUBLIC_STREAM_TRPC_HTTP_URL);
  const trpcWsUrl = urlSchema.parse(process.env.PUBLIC_STREAM_TRPC_WS_URL);

  return { httpUrl: trpcHttpUrl, wsUrl: trpcWsUrl } satisfies EndpointUrl;
}

export default function GlobalLayout({ loaderData }: Route.ComponentProps) {
  return (
    <StoreProvider>
      <StreamEndpointHydrator url={loaderData}>
        <Outlet />
      </StreamEndpointHydrator>
    </StoreProvider>
  );
}
