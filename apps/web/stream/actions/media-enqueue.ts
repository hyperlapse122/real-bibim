'use server';

import { match, P } from 'ts-pattern';
import { getClient } from '@/utils/connect/server';
import { ChannelService } from '@real-bibim/protos/hyperlapse/bibim/v1/channel_pb';
import { ConnectError } from '@connectrpc/connect';

export type MediaEnqueueRequest = {
  channelId: string;
  mediaUrl: string;
};

export type MediaEnqueueResponse =
  | {
      success: true;
    }
  | {
      success: false;
      error: string;
    };

export async function mediaEnqueue({
  channelId: stringChannelId,
  mediaUrl,
}: MediaEnqueueRequest): Promise<MediaEnqueueResponse> {
  const client = getClient(ChannelService);

  try {
    const channelId = BigInt(stringChannelId);
    await client.mediaEnqueue({
      channelId,
      url: mediaUrl,
    });
    return { success: true };
  } catch (e) {
    return {
      success: false,
      error: match(e)
        .with(P.instanceOf(ConnectError), (e) => e.message)
        .with(P.instanceOf(Error), (e) => e.message)
        .otherwise(() => 'Unknown error'),
    };
  }
}
