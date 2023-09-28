import { getFirestore, doc, getDoc, query, getDocs, where, collection } from 'firebase/firestore';
import firebaseApp from '$lib/firebaseInit.ts';

const cache = new Map();
const db = getFirestore(firebaseApp);

async function getProfilePicture(id: string, isUID = false): Promise<void | string> {
	const photoURL = cache.get(id);
	if (photoURL) return photoURL;

	try {
		if (isUID) {
			const userRef = doc(db, 'users', id);
			const user = await getDoc(userRef);
			const { photoURL } = user.data();
			if (!photoURL) {
				throw new Error('User has no profile picture');
			}
			cache.set(id, photoURL);
			return photoURL;
		} else {
			const usersRef = collection(db, 'users');
			const q = query(usersRef, where('username', '==', id));
			const snap = await getDocs(q);
			const { photoURL } = snap.docs[0].data();
			if (!photoURL) {
				throw new Error('User has no profile picture');
			}
			cache.set(id, photoURL);
			return photoURL;
		}
	} catch (error) {
		//	console.info(error);
	}
}

export default getProfilePicture;
