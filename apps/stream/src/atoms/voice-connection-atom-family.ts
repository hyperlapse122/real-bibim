import { atomFamily, atomWithRefresh } from 'jotai/utils';
import {
  type DiscordGatewayAdapterCreator,
  entersState,
  joinVoiceChannel,
  VoiceConnectionStatus,
} from '@discordjs/voice';
import audioPlayerAtomFamily from '@/atoms/audio-player-atom-family.js';
import { atomEffect } from 'jotai-effect';
import { atom } from 'jotai';

export type VoiceConnectionArgument = {
  guildId: string;
  channelId: string;
  adaptorCreator?: DiscordGatewayAdapterCreator;
};

const voiceConnectionAtomFamily = atomFamily(
  (args: VoiceConnectionArgument) => {
    const adaptorCreator = args.adaptorCreator;
    if (!adaptorCreator) {
      throw new Error('adaptorCreator is required');
    }

    const internalAtom = atomWithRefresh(async (get) => {
      const connection = joinVoiceChannel({
        adapterCreator: adaptorCreator,
        channelId: args.channelId,
        guildId: args.guildId,
      });

      await entersState(connection, VoiceConnectionStatus.Ready, 30000);
      connection.subscribe(get(audioPlayerAtomFamily(args.channelId)));

      return connection;
    });

    const effect = atomEffect((get, set) => {
      get(internalAtom).then((c) =>
        c.addListener(VoiceConnectionStatus.Destroyed, () => {
          set(internalAtom);
        }),
      );
    });

    return atom((get) => {
      get(effect);
      return get(internalAtom);
    });
  },
  (a, b) =>
    a.guildId === b.guildId &&
    a.channelId === b.channelId &&
    (a.adaptorCreator === b.adaptorCreator || !b.adaptorCreator),
);

export default voiceConnectionAtomFamily;
