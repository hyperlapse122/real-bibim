import dotenv from 'dotenv';
import express, { type Express } from 'express';
import { match, Pattern } from 'ts-pattern';
import cors from 'cors';

dotenv.config({
  path: ['.env.local', '.env'],
});

const app = express();

app.use(cors());

app.get('/', (req, res) => {
  res.send('Hello, Express with Vite and TypeScript!!');
});

if (import.meta.env.PROD) {
  const port = match(Number(process.env.PORT))
    .with(Pattern.number.int().between(1, 65535), (e) => e)
    .otherwise((e) => {
      console.warn(
        'PORT environment variable is not set or invalid, defaulting to 3000.',
      );
      console.debug('PORT environment variable value:', e);
      return 3000;
    });
  app.listen(port, () => {
    if (process.env.NODE_ENV !== 'production')
      console.log(`Server running at http://localhost:${port}`);
  });
}

export const viteNodeApp: Express = app;

const { init: discordInit } = await import('@/bot.js');
discordInit().then(() => {
  console.log('Discord client initialized');
});
