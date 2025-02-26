'use client';

import { useAtomValue } from 'jotai';
import { streamTrpcClientAtom } from '../atoms/stream-trpc-client-atom';
import { useEffect, useState } from 'react';

export default function StreamHealthCheckTime({
  initialTimestamp,
}: {
  initialTimestamp?: number;
}) {
  const [timestamp, setTimestamp] = useState<number>(initialTimestamp ?? 0);
  const client = useAtomValue(streamTrpcClientAtom);

  useEffect(() => {
    const unsubscribe = client.healthCheck.subscribe(
      {
        interval: 100,
      },
      {
        onData: (e) => {
          setTimestamp(e.timestamp);
        },
        onError: console.error,
        onConnectionStateChange: console.info,
      },
    );

    return () => {
      unsubscribe.unsubscribe();
    };
  }, [client]);

  return <span className="tabular-nums">{timestamp}</span>;
}
