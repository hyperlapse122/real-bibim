import {atomFamily} from "jotai/utils";
import {atom} from "jotai";
import {AudioPlayerStatus, createAudioPlayer, NoSubscriberBehavior} from "@discordjs/voice";

const audioPlayerAtomFamily = atomFamily((channelId: string) => {
    return atom(() => {
        const player = createAudioPlayer({
            behaviors: {
                noSubscriber: NoSubscriberBehavior.Play,
                maxMissedFrames: Math.round(5000 / 20),
            },
        })
        player.on('stateChange', (oldState, newState) => {
            if (oldState.status === AudioPlayerStatus.Idle && newState.status === AudioPlayerStatus.Playing) {
                console.log(channelId, 'Playing audio output on audio player');
            } else if (newState.status === AudioPlayerStatus.Idle) {
                console.log(channelId, 'Playback has stopped');
            }
        });
        return player;
    });
})

export default audioPlayerAtomFamily;