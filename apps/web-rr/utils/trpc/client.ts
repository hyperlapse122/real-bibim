'use client';

import { createTRPCContext } from '@trpc/tanstack-react-query';
import type { AppRouter } from '@real-bibim/stream/router';

export const { TRPCProvider, useTRPC } = createTRPCContext<AppRouter>();
