import type { ConnectRouter } from '@connectrpc/connect';
import { ElizaService } from '@real-bibim/protos/connectrpc/eliza/v1/eliza_pb';

export default (router: ConnectRouter) =>
  // registers connectrpc.eliza.v1.ElizaService
  router.service(ElizaService, {
    // implements rpc Say
    async say(req) {
      return {
        sentence: `You said: ${req.sentence}`,
      };
    },
  });
