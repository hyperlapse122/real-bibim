import type { ServiceImpl } from '@connectrpc/connect';
import type {
  ChannelService,
  IsConnectedRequest,
  MediaEnqueueRequest,
} from '@real-bibim/protos/hyperlapse/bibim/v1/channel_pb';
import store from '@/atoms/store';
import voiceConnectionAtomFamily from '@/atoms/voice-connection-atom-family';
import mediaQueueAtomFamily from '@/atoms/media-queue-atom-family';

export class ChannelServiceImpl implements ServiceImpl<typeof ChannelService> {
  async isConnected(req: IsConnectedRequest) {
    try {
      await store.get(
        voiceConnectionAtomFamily({
          channelId: req.channelId.toString(),
        }),
      );
      return {
        connected: true,
      };
    } catch {
      return {
        connected: false,
      };
    }
  }

  async mediaEnqueue({ channelId, url }: MediaEnqueueRequest) {
    const queue = store.get(mediaQueueAtomFamily(channelId.toString()));
    // const info = await store.get(videoInfoAtomFamily(url));
    queue.enqueue({
      createdBy: '',
      url,
    });
    return {};
  }
}
