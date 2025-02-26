import { initTRPC } from '@trpc/server';
import { z } from 'zod';
import type { Context } from '@/trpc/context.js';

export const t = initTRPC.context<Context>().create();
export const appRouter = t.router({
  heathCheck: t.procedure
    .output(
      z.object({
        timestamp: z.number(),
      }),
    )
    .query(() => ({
      timestamp: Date.now(),
    })),
});
// export type definition of API
export type AppRouter = typeof appRouter;
