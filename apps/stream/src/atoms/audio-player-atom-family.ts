import {atomFamily} from "jotai/utils";
import {atom} from "jotai";
import {
    AudioPlayerStatus,
    createAudioPlayer,
    createAudioResource,
    NoSubscriberBehavior,
    StreamType
} from "@discordjs/voice";
import {withAtomEffect} from "jotai-effect";
import mediaQueueAtomFamily from "@/atoms/media-queue-atom-family";
import {QueueEvent} from "@/utils/queue";
import createAudioReadable from "@/utils/create-audio-readable";

const audioPlayerAtomFamily = atomFamily((channelId: string) => {
    const playerAtom = withAtomEffect(atom(
        createAudioPlayer({
            behaviors: {
                noSubscriber: NoSubscriberBehavior.Play,
                maxMissedFrames: Math.round(5000 / 20),
            },
        })
    ), (get) => {
        const player = get(playerAtom);
        const queue = get(mediaQueueAtomFamily(channelId));

        queue.on(QueueEvent.ENQUEUE, onEnqueueOnIdle);
        player.on('stateChange', onStateChangedToIdle)

        return () => {
            queue.off(QueueEvent.ENQUEUE, onEnqueueOnIdle);
            player.off('stateChange', onStateChangedToIdle)
        }

        function onEnqueueOnIdle() {
            console.log(channelId, player.state.status);
            if (player.state.status !== AudioPlayerStatus.Idle) return;
            console.log(channelId, 'Enqueueing audio output on audio player');

            const item = queue.dequeue();
            if (!item) return;
            player.play(createAudioResource(createAudioReadable(item.url), {
                inputType: StreamType.OggOpus,
            }));
        }

        function onStateChangedToIdle(oldState: unknown, newState: {
            status: AudioPlayerStatus,
        }) {
            console.log(channelId, newState.status, queue.peek());
            if (!(newState.status === AudioPlayerStatus.Idle && queue.peek())) return;
            console.log(channelId, 'Dequeueing audio output on audio player');

            const item = queue.dequeue();
            if (!item) return;
            player.play(createAudioResource(createAudioReadable(item.url), {
                inputType: StreamType.OggOpus,
            }));
        }
    });

    return playerAtom;
})

export default audioPlayerAtomFamily;