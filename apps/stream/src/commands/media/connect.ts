import {ChatInputCommandInteraction, GuildMember, SlashCommandBuilder} from "discord.js";
import {createAudioResource, StreamType} from "@discordjs/voice";
import store from "@/atoms/store";
import voiceConnectionAtomFamily from "@/atoms/voice-connection-atom-family";
import audioPlayerAtomFamily from "@/atoms/audio-player-atom-family";
import createAudioReadable from "@/utils/create-audio-readable";

export const data = new SlashCommandBuilder()
    .setName('connect')
    .setDescription('Connect to voice channel')

export async function execute(interaction: ChatInputCommandInteraction) {
    const member = interaction.member as GuildMember;
    const voiceChannel = member.voice.channel;

    if (!voiceChannel) {
        await interaction.reply('You need to be in a voice channel to play music!');
        return;
    }

    const {id: channelId, guild: {id: guildId, voiceAdapterCreator}} = voiceChannel;

    await interaction.reply('Connecting...');
    try {
        await store.get(voiceConnectionAtomFamily({
            channelId,
            guildId,
            adaptorCreator: voiceAdapterCreator,
        }))
        const player = store.get(audioPlayerAtomFamily(channelId));
        await interaction.editReply('Connected!');

        const audioResource = createAudioResource(
            createAudioReadable('https://www.youtube.com/watch?v=G5mPgsBDhMo'),
            {
                inputType: StreamType.OggOpus,
            }
        )
        player.play(audioResource);
    } catch (e) {
        console.error(e);
        await interaction.editReply('Failed to connect!');
    }
}