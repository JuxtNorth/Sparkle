import { redirect } from '@sveltejs/kit';
import { getFirebaseUser } from '$lib/Utils';
import firebaseApp from '$lib/firebaseInit.ts';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

const db = getFirestore(firebaseApp);

/** @type {import('./$types').PageLoad} */
export async function load({ params }) {
	const { slug: username } = params;
	// Check if a chat with user already exists
	const self = await getFirebaseUser();
	if (!self) throw redirect(307, '/');
	const path = `users/${self.uid}/chats/${username}`;
	const chatRef = doc(db, path);
	const chat = await getDoc(chatRef);

	if (chat.exists()) {
		// Somehow also flash the chat??
		throw redirect(307, '/chatlist');
	}

	const userRef = doc(db, `usernames/${username}`);
	const user = await getDoc(userRef);

	// Throw exception if user doesn't exist

	return {
		self: self,
		username: username,
		uid: user.data().uid
	};
}
