import { writable } from 'svelte/store';

export type state = 'calling' | 'call-recieved' | 'call-ended' | 'call-accepted' | null;
export const callState = writable<state>();

export const firebaseUser = writable();
export const isChatOpen = writable(false);
export const remoteStream = writable();
export const localStream = writable();
export const peerInstantiator = writable(null);
export const peerInstance = writable(null);
export const peerMediaCall = writable();
export const inCallWith = writable();
export const selfUsername = writable();
export const toast = writable('');
