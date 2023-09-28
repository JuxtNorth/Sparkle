import { remoteStream, localStream, peerInstance } from '$lib/stores';
import { get } from 'svelte/store';
import type { Peer } from 'peerjs';
import { getFirebaseUser } from '$lib/Utils';

type MediaType = 'video' | 'voice';

async function getPeerInstance(): Promise<Peer> {
	let peer = get(peerInstance);
	if (peer === null) {
		return await getNewPeerInstance();
	}
	return peer;
}

async function getNewPeerInstance(): Promise<Peer> {
	const { default: Peer } = await import('peerjs');
	const peer = new Peer();
	peerInstance.set(peer);
	return peer;
}

async function getUserMedia(type: MediaType): Promise<void | MediaStream> {
	try {
		if (!['voice', 'video'].includes(type)) {
			throw new Error('Unsupported Media type: ' + type);
		}
		if (window?.navigator == null) {
			throw new Error('This function can only be invoked on the client side');
		}
		const streamConfigs = {
			audio: true,
			video: type === 'video' ? { width: 1920, height: 1080 } : false
		};
		const stream = await navigator.mediaDevices.getUserMedia(streamConfigs);
		localStream.set(stream);
		return stream;
	} catch (error) {
		console.error(error);
	}
}

async function call(
	type: MediaType,
	peerID: string,
	onStream: (MediaStream) => void,
	onClose: () => void
): Promise<any> {
	try {
		const stream = <MediaStream>await getUserMedia(type);
		const peer = await getPeerInstance();
		const self = await getFirebaseUser();
		const call = peer.call(peerID, stream, {
			metadata: {
				username: self.displayName,
				type: type
			}
		});
		call.on('stream', (stream) => {
			remoteStream.set(stream);
			onStream(stream);
		});
		call.on('close', () => {
			get(localStream)
				?.getTracks()
				.forEach((track) => {
					track.stop();
				});
			onClose();
		});
		return call;
	} catch (error) {
		throw new Error('Call failed ', error);
	}
}

async function setCallsListener(): Promise<void> {
	const peer = await getPeerInstance();
}

async function setStreamListener(): Promise<void> {
	const peer = await getPeerInstance();
}

export {
	getPeerInstance,
	getUserMedia,
	call,
	setCallsListener,
	setStreamListener,
	getNewPeerInstance,
	type MediaType
};
