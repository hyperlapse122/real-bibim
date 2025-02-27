import { createTRPCClient } from 'utils/trpc/server';
import type { Route } from './+types/health-check';

export async function loader({}: Route.LoaderArgs) {
  const client = createTRPCClient();
  await client.heathCheck.query();
  return {
    stream: 'OK',
  };
}
