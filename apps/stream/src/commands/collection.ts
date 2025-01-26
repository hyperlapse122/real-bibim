import {Command} from "./command";

export const collection = new Map<string, Command>();

await register();

async function register() {
    const commands: Command[] = await Promise.all([
        import('./utils/user'),
        import('./utils/ping'),
        import('./media/music'),
    ])
    for (let command of commands) {
        collection.set(command.data.name, command);
    }
}