import { getFirebaseUser } from '$lib/Utils';
import { redirect } from '@sveltejs/kit';

/** @type {import('./$types').PageLoad} */
export async function load() {
	let user;
	try {
		user = await getFirebaseUser();
		return {
			self: user
		};
	} catch (error) {
		throw redirect(307, '/');
	}
}
