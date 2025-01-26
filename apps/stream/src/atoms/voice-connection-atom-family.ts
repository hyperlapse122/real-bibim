import {atomFamily} from "jotai/utils";
import {InternalDiscordGatewayAdapterCreator} from "discord.js";
import {joinVoiceChannel} from "@discordjs/voice";
import {atom} from "jotai";

export type VoiceConnectionArgument = {
    guildId: string,
    channelId: string,
    adaptorCreator?: InternalDiscordGatewayAdapterCreator,
}

const voiceConnectionAtomFamily = atomFamily((args: VoiceConnectionArgument) => {
    if (!args.adaptorCreator) {
        throw new Error("adaptorCreator is required");
    }
    return atom(() => joinVoiceChannel({
        adapterCreator: args.adaptorCreator!,
        channelId: args.channelId,
        guildId: args.guildId
    }));
}, (a, b) => a.guildId === b.guildId && a.channelId === b.channelId);

export default voiceConnectionAtomFamily;