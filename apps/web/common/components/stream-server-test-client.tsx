'use client';

import { say } from '@real-bibim/protos/connectrpc/eliza/v1/eliza-ElizaService_connectquery';
import { useQuery } from '@connectrpc/connect-query';

export default function StreamServerTestClient({
  sentence,
}: {
  sentence: string;
}) {
  const { data } = useQuery(say, { sentence });
  return <span>{data?.sentence}</span>;
}
