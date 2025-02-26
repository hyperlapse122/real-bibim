import dotenv from 'dotenv';
import express from 'express';
import { match, Pattern } from 'ts-pattern';
import * as trpcExpress from '@trpc/server/adapters/express';
import { type AppRouter, appRouter } from './trpc/app-router.js';
import { createContext } from '@/trpc/context.js';
import { applyWSSHandler } from '@trpc/server/adapters/ws';
import { WebSocketServer } from 'ws';
import cors from 'cors';

dotenv.config({
  path: ['.env.local', '.env'],
});

const app = express();
const port = match(Number(process.env.PORT))
  .with(Pattern.number.int().between(1, 65535), (e) => e)
  .otherwise((e) => {
    console.warn(
      'PORT environment variable is not set or invalid, defaulting to 3000.',
    );
    console.debug('PORT environment variable value:', e);
    return 3000;
  });

app.use(cors());
app.use(
  '/trpc',
  trpcExpress.createExpressMiddleware({
    router: appRouter,
    createContext,
  }),
);

app.get('/', (req, res) => {
  res.send('Hello, Express with Rollup and TypeScript!!');
});

const server = app.listen(port, () => {
  if (process.env.NODE_ENV !== 'production')
    console.log(`Server running at http://localhost:${port}`);
});

const wss = new WebSocketServer({
  server,
});

const handler = applyWSSHandler<AppRouter>({
  wss: wss as never,
  router: appRouter,
  createContext,
  // Enable heartbeat messages to keep connection open (disabled by default)
  keepAlive: {
    enabled: true,
    // server ping message interval in milliseconds
    pingMs: 30000,
    // connection is terminated if pong message is not received in this many milliseconds
    pongWaitMs: 5000,
  },
});

const { init: discordInit } = await import('@/bot.js');
discordInit().then(() => {
  console.log('Discord client initialized');
});

process.on('SIGTERM', () => {
  console.log('SIGTERM');
  handler.broadcastReconnectNotification();
  wss.close();
});
