import { initTRPC } from '@trpc/server';
import { z } from 'zod';
import type { Context } from '@/trpc/context.js';
import superjson from 'superjson';

export const t = initTRPC.context<Context>().create({
  transformer: superjson,
});
export const appRouter = t.router({
  ping: t.procedure
    .input(z.void())
    .output(z.void())
    .query(() => {}),
  healthCheck: t.procedure
    .input(
      z.object({
        interval: z.number().default(16),
      }),
    )
    .subscription(async function* (opts) {
      while (!opts.signal?.aborted) {
        yield {
          timestamp: Date.now(),
        };
        await new Promise((resolve) =>
          setTimeout(resolve, opts.input.interval),
        );
      }
    }),
});
// export type definition of API
export type AppRouter = typeof appRouter;
