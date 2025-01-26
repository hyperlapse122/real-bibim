import dotenv from 'dotenv';
import express from 'express';
import {match, Pattern} from "ts-pattern";
import {Client, Events, GatewayIntentBits, MessageFlags, Routes} from "discord.js";

dotenv.config({
    path: ['.env.local', '.env']
})

const app = express();
const port = match(Number(process.env.PORT))
    .with(Pattern.number.int().between(1, 65535), e => e)
    .otherwise((e) => {
        console.warn('PORT environment variable is not set or invalid, defaulting to 3000.');
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

discordInit().then(() => {
    console.log('Discord client initialized');
});

async function discordInit() {
    const {collection} = await import('./commands/collection');

    const client = new Client({intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages]});
    await client.login(process.env.DISCORD_TOKEN);

    const commands = collection.values().map(e => e.data.toJSON()).toArray()
    const data = (await client.rest.put(
        (Routes.applicationCommands(process.env.DISCORD_CLIENT_ID)),
        {
            body: commands
        }
    )) as unknown[];
    console.log(`Registered ${data.length} commands.`);

    client.on(Events.InteractionCreate, async (interaction) => {
        if (!interaction.isChatInputCommand()) return;
        const command = collection.get(interaction.commandName)
        if (!command) {
            console.warn('Unknown command name:', interaction.commandName);
            return;
        }

        try {
            await command.execute(interaction);
        } catch (error) {
            console.error(error);
            if (interaction.replied || interaction.deferred) {
                await interaction.followUp({
                    content: 'There was an error while executing this command!',
                    flags: MessageFlags.Ephemeral
                });
            } else {
                await interaction.reply({
                    content: 'There was an error while executing this command!',
                    flags: MessageFlags.Ephemeral
                });
            }
        }
    });
}
