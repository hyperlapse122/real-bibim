// created for each request
import * as trpcExpress from '@trpc/server/adapters/express';

export const createContext =
  ({}: trpcExpress.CreateExpressContextOptions) => ({}); // no context
export type Context = Awaited<ReturnType<typeof createContext>>;
// const t = initTRPC.context<Context>().create();
