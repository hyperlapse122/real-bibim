import type { ServiceImpl } from '@connectrpc/connect';
import type {
  ElizaService,
  SayRequest,
} from '@real-bibim/protos/connectrpc/eliza/v1/eliza_pb';

export class ElizaServiceImpl implements ServiceImpl<typeof ElizaService> {
  say(req: SayRequest) {
    return {
      sentence: `You said ${req.sentence}`,
    };
  }
}
