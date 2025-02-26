import type { Command } from './command.js';

export const collection = new Map<string, Command>();

await register();

async function register() {
  const commands: Command[] = await Promise.all<Command>([
    import('./utils/user.js'),
    import('./utils/ping.js'),
    import('./media/connect.js'),
    import('./media/disconnect.js'),
    import('./media/enqueue.js'),
  ]);
  for (const command of commands) {
    collection.set(command.data.name, command);
  }
}
