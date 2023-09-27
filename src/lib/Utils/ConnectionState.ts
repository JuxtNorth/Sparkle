import firebaseApp from '$lib/firebaseInit.ts';
import {
	getDatabase,
	onDisconnect,
	ref,
	set,
	onValue
} from 'firebase/database';

const db = getDatabase(firebaseApp);

function statePresence(selfUsername) {
	const userStateRef = ref(
		db,
		`users/${selfUsername}/isOnline`
	);
	set(userStateRef, true);
	onDisconnect(userStateRef).set(false);
}

function checkPresence(userID, callback): () => void {
	const userStateRef = ref(
		db,
		`users/${userID}/isOnline`
	);

	const unsubscribe = onValue(userStateRef, (snap) => {
		const isOnline = snap.exists() && snap.val();
		callback(isOnline);
	});

	return unsubscribe;
}

export { statePresence, checkPresence };
