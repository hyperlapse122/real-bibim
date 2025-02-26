import dotenv from 'dotenv';
import express from 'express';
import { match, Pattern } from 'ts-pattern';

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

app.get('/', (req, res) => {
  res.send('Hello, Express with Rollup and TypeScript!!');
});

app.listen(port, () => {
  if (process.env.NODE_ENV !== 'production')
    console.log(`Server running at http://localhost:${port}`);
});

const { init: discordInit } = await import('@/bot');
discordInit().then(() => {
  console.log('Discord client initialized');
});
