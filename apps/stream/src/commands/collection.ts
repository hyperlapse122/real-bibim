import {Command} from "./command";

export const collection = new Map<string, Command>();

await register();

async function register() {
    const commands: Command[] = await Promise.all<Command>([
        import('./utils/user'),
        import('./utils/ping'),
        import('./media/connect'),
        import('./media/disconnect'),
        import('./media/enqueue'),
    ])
    for (let command of commands) {
        collection.set(command.data.name, command);
    }
}