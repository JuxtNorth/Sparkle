import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';
import firebaseApp from '$lib/firebaseInit.ts';

const db = getFirestore(firebaseApp);

async function setProfilePicture({ uid, photoURL }) {
	const userRef = doc(db, 'users', uid);
	try {
		const user = await getDoc(userRef);
		if (!user.data().photoURL) {
			await updateDoc(userRef, {
				photoURL: photoURL
			});
		} else {
			throw new Error('Profile Picture already exists');
		}
	} catch (error) {
		//	console.info('Cannot overwrite profile: ', error);
	}
}

export default setProfilePicture;
