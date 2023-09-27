import MediaStreamer from './MediaStreamer.ts';
import { selfUsername } from '$lib/stores';
import {
	getDatabase,
	ref,
	onDisconnect
} from 'firebase/database';
import firebaseApp from '$lib/firebaseInit.ts';

const db = getDatabase(firebaseApp);
const streamer = new MediaStreamer();

selfUsername.subscribe((username) => {
	if (username?.length === 0) return;
	streamer.mediaConnectionStatusRef = ref(
		db,
		`users/${username}/mediaConnectionStatus`
	);
	streamer.selfUsername = username;
	onDisconnect(streamer.mediaConnectionStatusRef).set(
		'unavailable'
	);
});

function getMediaStreamer() {
	return streamer;
}

export default getMediaStreamer;
