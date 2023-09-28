<script>
	import { firebaseUser } from '$lib/stores';
	import firebaseApp from '$lib/firebaseInit.ts';
	import { getAuth, onAuthStateChanged } from 'firebase/auth';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import '@fontsource-variable/comfortaa';

	onMount(() => {
		const auth = getAuth(firebaseApp);
		onAuthStateChanged(auth, (user) => {
			if (user) {
				firebaseUser.set(user);
				goto('/chatlist');
			} else {
				goto('/signup');
			}
		});
	});
</script>

<img src="/image/sparkle-logo.png" alt="Sparkle Logo" />
<h2>Sparkle Web</h2>

<style lang="scss">
	:global(body) {
		background: #f4f6ff;
		img {
			aspect-ratio: 1;
			height: 96px;
			border-radius: 1.2em;
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
			box-shadow: 0 0 36px 0 #00000011;
		}
		h2 {
			position: absolute;
			bottom: 5%;
			left: 50%;
			transform: translateX(-50%);
			font-family: 'Comfortaa variable', sans-serif;
			color: #444;
		}
	}
</style>
