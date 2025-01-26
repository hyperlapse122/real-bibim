import {ChatInputCommandInteraction, GuildMember, SlashCommandBuilder} from "discord.js";
import mediaQueueAtomFamily from "@/atoms/media-queue-atom-family";
import store from "@/atoms/store";

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

    const {id: channelId} = voiceChannel;

    await interaction.reply('Enqueuing...');
    const queue = store.get(mediaQueueAtomFamily(channelId));

    queue.enqueue({
        createdBy: member.user.tag,
        url,
    })
    await interaction.editReply('Enqueued!');
}