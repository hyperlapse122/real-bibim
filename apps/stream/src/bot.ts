import {
  Client,
  Events,
  GatewayIntentBits,
  MessageFlags,
  Routes,
} from 'discord.js';

export async function init() {
  const { collection } = await import('@/commands/collection');

  const client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.GuildVoiceStates,
    ],
  });

  client.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.isChatInputCommand()) return;
    const command = collection.get(interaction.commandName);
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
          flags: MessageFlags.Ephemeral,
        });
      } else {
        await interaction.reply({
          content: 'There was an error while executing this command!',
          flags: MessageFlags.Ephemeral,
        });
      }
    }
  });

  await client.login(process.env.DISCORD_TOKEN);

  const commands = collection
    .values()
    .map((e) => e.data.toJSON())
    .toArray();
  const data = (await client.rest.put(
    process.env.DISCORD_GUILD_ID
      ? Routes.applicationGuildCommands(
          process.env.DISCORD_CLIENT_ID,
          process.env.DISCORD_GUILD_ID,
        )
      : Routes.applicationCommands(process.env.DISCORD_CLIENT_ID),
    {
      body: commands,
    },
  )) as unknown[];
  console.log(`Registered ${data.length} commands.`);
}
