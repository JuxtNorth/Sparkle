<script lang="ts">
	import type { PageData } from './$types';
	import '@fontsource-variable/mulish';
	import '@fontsource/varela-round';
	import '@fontsource-variable/comfortaa';
	import {
		getFirebaseUser,
		getPeerInstance,
	} from '$lib/Utils';
	import {
		PageTransition,
		CallPrompt,
		Toast
	} from '$lib/Components';
	import {
		onAuthStateChanged,
		getAuth
	} from 'firebase/auth';
	import { getFirestore } from 'firebase/firestore';
	import { onMount } from 'svelte';
	import firebaseApp from '$lib/firebaseInit.ts';

	export let data: PageData;

	onMount(() => {
		/*
	    This function instantiates a peer class and stores it inside a svelte store. We call this here so that the object has time to initialise before the user makes a call or else. 
	  */
		getPeerInstance();
	});
</script>

<Toast />
<CallPrompt />
<PageTransition key={data.url}>
	<slot />
</PageTransition>

<style lang="scss">
	:global(body) {
		background: #f4f6ff;
		padding: 0;
		margin: 0;
		overflow: hidden;
	}
</style>
