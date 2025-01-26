import {ChatInputCommandInteraction, GuildMember, SlashCommandBuilder} from "discord.js";
import {AudioPlayerStatus, createAudioPlayer, NoSubscriberBehavior} from "@discordjs/voice";

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
    .setName('play')
    .setDescription('Play some music!')

export async function execute(interaction: ChatInputCommandInteraction) {
    const member = interaction.member as GuildMember;
    const voiceChannel = member.voice.channel;

    if (!voiceChannel) {
        await interaction.reply('You need to be in a voice channel to play music!');
        return;
    }

    await interaction.reply('Connecting...');
}