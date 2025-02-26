import { atom } from 'jotai';

export type EndpointUrl = {
  httpUrl: string;
  wsUrl: string;
};

export const endpointUrlAtom = atom<EndpointUrl>({
  httpUrl: '',
  wsUrl: '',
});
endpointUrlAtom.debugLabel = 'endpointUrlAtom';
