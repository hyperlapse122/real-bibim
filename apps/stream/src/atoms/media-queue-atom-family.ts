import {atomFamily} from "jotai/utils";
import {atom} from "jotai";
import Queue from "@/utils/queue";

export type MediaQueueItem = {
    url: string,
    createdBy: string,
}

const mediaQueueAtomFamily = atomFamily((channelId: string) => {
    return atom<Queue<MediaQueueItem>>(new Queue<MediaQueueItem>());
});

export default mediaQueueAtomFamily;