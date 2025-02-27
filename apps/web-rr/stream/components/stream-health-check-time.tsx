'use client';

import { useTRPC } from '@/utils/trpc/client';
import { useSubscription } from '@trpc/tanstack-react-query';

export default function StreamHealthCheckTime() {
  const trpc = useTRPC();
  const { data } = useSubscription(
    trpc.healthCheck.subscriptionOptions(
      { interval: 1000 / 120 },
      { enabled: true },
    ),
  );

  return <span className="tabular-nums">{data?.timestamp}</span>;
}
