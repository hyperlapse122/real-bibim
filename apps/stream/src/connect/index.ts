import type { ConnectRouter } from '@connectrpc/connect';
import { ElizaService } from '@real-bibim/protos/connectrpc/eliza/v1/eliza_pb';
import { ElizaServiceImpl } from '@/connect/eliza-service-impl';
import { ChannelServiceImpl } from '@/connect/channel-service-impl';
import { ChannelService } from '@real-bibim/protos/hyperlapse/bibim/v1/channel_pb';

export default (router: ConnectRouter) => {
  router.service(ElizaService, new ElizaServiceImpl());
  router.service(ChannelService, new ChannelServiceImpl());
};
