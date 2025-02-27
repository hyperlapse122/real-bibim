import { Outlet } from 'react-router';
import type { Route } from './+types/global-layout';
import * as process from 'node:process';
import { z } from 'zod';
import JotaiStoreProvider from '@/common/components/jotai-store-provider';
import TanStackQueryClientProvider from '@/common/components/tan-stack-query-client-provider';
import type { StreamEndpointUrl } from '@/stream/schemas/stream-endpoint-url-schema';

const urlSchema = z.string().url();

export async function loader({}: Route.LoaderArgs) {
  const trpcHttpUrl = urlSchema.parse(process.env.PUBLIC_STREAM_TRPC_HTTP_URL);
  const trpcWsUrl = urlSchema.parse(process.env.PUBLIC_STREAM_TRPC_WS_URL);

  return { httpUrl: trpcHttpUrl, wsUrl: trpcWsUrl } satisfies StreamEndpointUrl;
}

export default function GlobalLayout({ loaderData }: Route.ComponentProps) {
  return (
    <JotaiStoreProvider>
      <TanStackQueryClientProvider url={loaderData}>
        <Outlet />
      </TanStackQueryClientProvider>
    </JotaiStoreProvider>
  );
}
