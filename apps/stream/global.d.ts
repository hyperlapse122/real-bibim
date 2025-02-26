declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT: `${number}`;
      NODE_ENV: 'development' | 'production';
      DISCORD_TOKEN: string;
      DISCORD_CLIENT_ID: `${number}`;
      DISCORD_GUILD_ID?: `${number}`;
    }
  }
}

export {};
