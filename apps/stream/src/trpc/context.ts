// created for each request
import type { CreateExpressContextOptions } from '@trpc/server/adapters/express';
import type { CreateWSSContextFnOptions } from '@trpc/server/adapters/ws';

export const createContext = ({}:
  | CreateExpressContextOptions
  | CreateWSSContextFnOptions) => ({}); // no context
export type Context = Awaited<ReturnType<typeof createContext>>;
// const t = initTRPC.context<Context>().create();
