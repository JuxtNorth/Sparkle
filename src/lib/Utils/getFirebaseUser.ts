import {
	onAuthStateChanged,
	getAuth
} from 'firebase/auth';
import { get } from 'svelte/store';
import { firebaseUser } from '$lib/stores';
import firebaseApp from '$lib/firebaseInit.ts';
import { setProfilePicture } from '$lib/Utils';

async function getFirebaseUser(): Promise<void> {
	let user = get(firebaseUser);
	if (user) return user;
	const auth = getAuth(firebaseApp);
	await new Promise((resolve, reject) => {
		onAuthStateChanged(auth, (newUser) => {
			if (newUser) {
				firebaseUser.set(newUser);
				user = newUser;
				resolve(newUser);
			} else {
				reject();
			}
		});
		return user;
	});
}

export default getFirebaseUser;
