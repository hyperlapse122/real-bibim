import {
  ChatInputCommandInteraction,
  GuildMember,
  SlashCommandBuilder,
} from 'discord.js';
import store from '@/atoms/store.js';
import voiceConnectionAtomFamily from '@/atoms/voice-connection-atom-family.js';
import audioPlayerAtomFamily from '@/atoms/audio-player-atom-family';

export const data = new SlashCommandBuilder()
  .setName('connect')
  .setDescription('Connect to voice channel');

export async function execute(interaction: ChatInputCommandInteraction) {
  const member = interaction.member as GuildMember;
  const voiceChannel = member.voice.channel;

  if (!voiceChannel) {
    await interaction.reply('You need to be in a voice channel to play music!');
    return;
  }

  const {
    id: channelId,
    guild: { id: guildId, voiceAdapterCreator },
  } = voiceChannel;

  await interaction.reply('Connecting...');
  try {
    store.sub(audioPlayerAtomFamily(channelId), () => {});
    await store.get(
      voiceConnectionAtomFamily({
        channelId,
        guildId,
        adaptorCreator: voiceAdapterCreator,
      }),
    );
    await interaction.editReply('Connected!');
  } catch (e) {
    console.error(e);
    await interaction.editReply('Failed to connect!');
  }
}
