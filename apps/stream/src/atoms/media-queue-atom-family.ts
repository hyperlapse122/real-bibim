import { atomFamily } from 'jotai/utils';
import { atom } from 'jotai';
import Queue from '@/utils/queue.js';

export type MediaQueueItem = {
  url: string;
  createdBy: string;
};

const mediaQueueAtomFamily = atomFamily((channelId: string) => {
  const mediaQueueAtom = atom<Queue<MediaQueueItem>>(
    new Queue<MediaQueueItem>(),
  );
  mediaQueueAtom.debugLabel = `mediaQueueAtom(${channelId})`;
  return mediaQueueAtom;
});

export default mediaQueueAtomFamily;
