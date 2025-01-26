import {ChatInputCommandInteraction, GuildMember, SlashCommandBuilder} from "discord.js";
import {
    AudioPlayerStatus,
    createAudioPlayer,
    entersState,
    NoSubscriberBehavior,
    VoiceConnectionStatus
} from "@discordjs/voice";
import store from "@/atoms/store";
import voiceConnectionAtomFamily from "@/atoms/voice-connection-atom-family";

const player = createAudioPlayer({
    behaviors: {
        noSubscriber: NoSubscriberBehavior.Play,
        maxMissedFrames: Math.round(5000 / 20),
    },
});

player.on('stateChange', (oldState, newState) => {
    if (oldState.status === AudioPlayerStatus.Idle && newState.status === AudioPlayerStatus.Playing) {
        console.log('Playing audio output on audio player');
    } else if (newState.status === AudioPlayerStatus.Idle) {
        console.log('Playback has stopped');
    }
});

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

    const connection = store.get(voiceConnectionAtomFamily({
        channelId,
        guildId,
        adaptorCreator: voiceAdapterCreator,
    }))

    await interaction.reply('Connecting...');
    try {
        await entersState(connection, VoiceConnectionStatus.Ready, 30000)
        await interaction.editReply('Connected!');
    } catch (e) {
        console.error(e);
        await interaction.editReply('Failed to connect!');
        connection.destroy();
    }
}