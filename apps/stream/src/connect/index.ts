import type { ConnectRouter } from '@connectrpc/connect';
import { ElizaService } from '@real-bibim/protos/connectrpc/eliza/v1/eliza_pb';
import { ElizaServiceImpl } from '@/connect/eliza-service-impl';

export default (router: ConnectRouter) => {
  router.service(ElizaService, new ElizaServiceImpl());
};
