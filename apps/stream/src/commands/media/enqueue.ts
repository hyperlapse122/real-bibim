import {ChatInputCommandInteraction, GuildMember, SlashCommandBuilder} from "discord.js";
import mediaQueueAtomFamily from "@/atoms/media-queue-atom-family";
import store from "@/atoms/store";
import videoInfoAtomFamily from "@/atoms/video-info-atom-family";

export const data = new SlashCommandBuilder()
    .setName('enqueue')
    .setDescription('Enqueue a music')
    .addStringOption(option => option.setName('url').setDescription('URL of the music').setRequired(true));

export async function execute(interaction: ChatInputCommandInteraction) {
    const member = interaction.member as GuildMember;
    const voiceChannel = member.voice.channel;

    if (!voiceChannel) {
        await interaction.reply('You need to be in a voice channel to play music!');
        return;
    }

    const url = interaction.options.getString('url');
    if (!url) {
        await interaction.reply('You need to provide a URL!');
        return;
    }

    await interaction.reply('Enqueuing...');

    const {id: channelId} = voiceChannel;

    try {
        const queue = store.get(mediaQueueAtomFamily(channelId));
        const info = await store.get(videoInfoAtomFamily(url));
        queue.enqueue({
            createdBy: member.user.tag,
            url,
        })
        await interaction.editReply(`[${info.title}](${info.original_url}) by ${info.uploader_url && `[${info.uploader}](${info.uploader_url})` || info.uploader} is enqueued!`);
    } catch (e) {
        console.error(e);
        await interaction.editReply('Failed to enqueue!');
    }
}