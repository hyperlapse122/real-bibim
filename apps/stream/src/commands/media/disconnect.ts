import {ChatInputCommandInteraction, GuildMember, SlashCommandBuilder} from "discord.js";
import {entersState, VoiceConnectionStatus} from "@discordjs/voice";
import store from "@/atoms/store";
import voiceConnectionAtomFamily from "@/atoms/voice-connection-atom-family";

export const data = new SlashCommandBuilder()
    .setName('disconnect')
    .setDescription('Disconnect from voice channel')

export async function execute(interaction: ChatInputCommandInteraction) {
    const member = interaction.member as GuildMember;
    const voiceChannel = member.voice.channel;

    if (!voiceChannel) {
        await interaction.reply('You need to be in a voice channel to play music!');
        return;
    }

    const {id: channelId, guild: {id: guildId, voiceAdapterCreator}} = voiceChannel;

    const connection = store.get(voiceConnectionAtomFamily({
        channelId,
        guildId,
        adaptorCreator: voiceAdapterCreator,
    }))

    await interaction.reply('Disconnecting...');
    try {
        connection.destroy();
        await interaction.editReply('Disconnected!');
    } catch (e) {
        console.error(e);
        await interaction.editReply('Failed to disconnect!');
        connection.destroy();
    }
}