import {
	getPeerInstance,
	getNewPeerInstance,
	getUserMedia,
	setCallsListener,
	setStreamListener,
	type MediaType
} from './MediaStreamUtils.ts';
import type { Peer, MediaConnection } from 'peerjs';
import { toast, inCallWith } from '$lib/stores';
import { getDatabase, ref, get, set, onValue, onDisconnect } from 'firebase/database';
import { getFirestore, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import firebaseApp from '$lib/firebaseInit.ts';
import { get as readStore } from 'svelte/store';

type EventName = 'open' | 'request' | 'accept' | 'reject' | 'close';
type RequestType = 'toSelf' | 'bySelf';

type OpenCallback = (string) => void;
type RequestCallback = (RequestType, MediaStream) => Promise<boolean>;
type AcceptCallback = (MediaStream) => void;
type RejectCallback = () => void;
type CloseCallback = () => void;

type MediaCallback =
	| OpenCallback
	| RequestCallback
	| AcceptCallback
	| RejectCallback
	| CloseCallback;

const db = getDatabase(firebaseApp);

class MediaStreamer {
	public call?: MediaConnection;
	public peer?: Peer;
	public peerConnectionID?: string;
	public localStream?: MediaStream;

	private mediaConnectionStatusRef?: any;
	private selfUsername?: string;

	private onOpen?: OpenCallback;
	private onRequest?: RequestCallback;
	private onAccept?: AcceptCallback;
	private onReject?: RejectCallback;
	private onClose?: CloseCallback;

	constructor() {
		getPeerInstance()
			.then((peer) => {
				this.peer = peer;
				this.addEventListeners();
			})
			.catch(console.error);
	}

	async placeCall(
		remotePeerID: string,
		remotePeerUsername: string,
		type: MediaType
	): Promise<void> {
		const { peer, onRequest, onAccept, onClose, selfUsername } = this;

		if (remotePeerUsername === selfUsername) {
			toast.set('');
			toast.set('Cannot call self');
			return;
		}

		const status = await get(this.mediaConnectionStatusRef);

		if (status === 'busy') {
			toast.set('');
			toast.set('Already in a call');
		}

		inCallWith.set(remotePeerUsername);
		this.showBusyStatus();

		const stream = await getUserMedia(type);
		this.localStream = stream;

		if (onRequest) onRequest('bySelf', stream);

		const call = peer.call(remotePeerID, stream, {
			metadata: { username: selfUsername, type }
		});

		let statusChangedOnce = false;

		const remotePeerStatusRef = ref(db, `users/${remotePeerUsername}/mediaConnectionStatus`);
		const unsubscribe = onValue(remotePeerStatusRef, (snap) => {
			const value = snap.val();
			if (value === 'busy' && !statusChangedOnce) {
				statusChangedOnce = true;
			}
			if (statusChangedOnce && value !== 'busy') {
				toast.set('Call rejected');
				unsubscribe();
				this.endCall();
			}
		});

		this.call = call;

		call.on('stream', (remoteStream) => {
			unsubscribe();
			if (onAccept) onAccept(remoteStream);
		});

		call.on('close', () => {
			unsubscribe();
			this.disconnect();
			if (onClose) onClose();
		});
	}

	endCall() {
		inCallWith.set(null);
		if (this.onClose) this.onClose();
		this.showAvailableStatus();
		this.disposeLocalStream();
		this.disconnect();
	}

	on(event: EventName, callback: MediaCallback): void {
		switch (event) {
			case 'open':
				this.onOpen = <OpenCallback>callback;
				break;

			case 'request':
				this.onRequest = <RequestCallback>callback;
				break;

			case 'accept':
				this.onAccept = <AcceptCallback>callback;
				break;

			case 'reject':
				this.onReject = <RejectCallback>callback;
				break;

			case 'close':
				this.onClose = <CloseCallback>callback;
				break;

			default:
				throw new TypeError('Unknown Event ', event);
		}
	}

	async addEventListeners() {
		const { peer, onOpen, onRequest, onAccept, onReject, onClose } = this;

		peer.on('open', (id) => {
			this.peerConnectionID = id;
			this.showAvailableStatus();
			if (onOpen) onOpen(id);
		});

		peer.on('call', async (call) => {
			this.call = call;
			this.showBusyStatus();

			const { username } = call.metadata;

			inCallWith.set(username);
			// Use this to listen to changes to db and call the close method accordingly.
			const remotePeerStatusRef = ref(db, `users/${username}/mediaConnectionStatus`);

			const unsubscribe = onValue(remotePeerStatusRef, (snap) => {
				console.log(snap.val());
				if (snap.val() !== 'busy') {
					unsubscribe();
					toast.set('Call cancelled');
					this.showAvailableStatus();
					if (onClose) onClose();
				}
			});

			if (onRequest) {
				const accepted = await onRequest('toSelf', call);
				unsubscribe();
				if (accepted) {
					const stream = await getUserMedia(call.metadata.type);
					this.localStream = stream;
					call.answer(stream);
				} else {
					this.disconnect();
					if (onReject) onReject();
				}

				call.on('stream', (remoteStream) => {
					onAccept(remoteStream);
				});

				call.on('close', () => {
					this.showAvailableStatus();
					this.disposeLocalStream();
					if (onClose) onClose();
				});
			} else {
				console.error('Undefined: requestHandler');
			}
		});
	}

	disconnect() {
		if (this.call) {
			this.disposeLocalStream();
			this.call.close();
			this.showAvailableStatus();
		} else {
			console.error('Unexpected end call invocation, call does no exist.');
		}
	}

	private disposeLocalStream() {
		try {
			this.localStream?.getTracks().forEach((track) => {
				track.stop();
			});
		} catch (error) {
			console.error(error);
		}
	}

	private showAvailableStatus(): void {
		if (!this.mediaConnectionStatusRef) return;
		set(this.mediaConnectionStatusRef, 'available');
	}

	private showBusyStatus(): void {
		if (!this.mediaConnectionStatusRef) return;
		set(this.mediaConnectionStatusRef, 'busy');
	}
}

export default MediaStreamer;
