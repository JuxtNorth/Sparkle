<script lang="ts">
	import * as Icons from '$lib/Icons';
	import { ripple } from '$lib/Effects';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import firebaseApp from '$lib/firebaseInit.ts';
	import { firebaseUser } from '$lib/stores';
	import {
		onAuthStateChanged,
		getAuth,
		signInWithPopup,
		GoogleAuthProvider
	} from 'firebase/auth';
	import {
		getFirestore,
		addDoc,
		getDocs,
		getDoc,
		collection,
		doc
	} from 'firebase/firestore';

	const db = getFirestore(firebaseApp);

	onMount(async () => {
		const auth = getAuth(firebaseApp);

		onAuthStateChanged(auth, async (user) => {
			if (!user) return;

			firebaseUser.set(user);

			const ref = doc(db, 'users', user.uid);
			const doc_ = await getDoc(ref);

			if (doc_.exists()) {
				goto('/chatlist');
			} else {
				goto('/setup-account');
			}
		});
	});

	async function authWithGoogle(): Promise<void> {
		const auth = getAuth(firebaseApp);
		try {
			signInWithPopup(auth, new GoogleAuthProvider());
		} catch (error) {
			console.error(error);
		}
	}
</script>

<div class="signup-options">
	<h1>Welcome<br />to Sparkle!</h1>
	<p>Create a new account.</p>
	<button
		class="btn-signup"
		id="gl"
		on:click={authWithGoogle}
		use:ripple
	>
		<div class="icon"><Icons.Google /></div>
		Sign up with Google
	</button>
	<button class="btn-signup" id="fb" use:ripple>
		<div class="icon"><Icons.Facebook /></div>
		Sign up with Facebook
	</button>
	<button
		class="btn-signup"
		id="em"
		on:click={() => goto('/signup/signup-email')}
		use:ripple
	>
		<div class="icon"><Icons.Email /></div>
		Sign up with E-Mail
	</button>
</div>

<p class="login-prompt">
	Already have an account? <a href="/signin">Sign in</a>
</p>

<style lang="scss">
	@use '$lib/styles/button';
	@use '$lib/styles/typography';

	$padding: 28px;

	div.signup-options {
		width: calc(100vw - $padding * 2);
		position: absolute;
		top: calc(50% - $padding);
		transform: translateY(-50%);
		display: flex;
		flex-direction: column;
		padding: $padding;
		h1 {
			font-family: typography.$comfortaa;
			font-weight: 700;
			font-size: 42px;
			color: typography.$on-background;
			margin-bottom: 0;
		}
		p {
			font-family: typography.$comfortaa;
			font-weight: 600;
			font-size: 18px;
			color: typography.$on-background-varient;
		}
		button.btn-signup {
			@include button.base();
			@include button.big();
			color: #fff;
			font-family: typography.$varela-round;
			font-size: 20px;
			margin: 8px 0;
			padding-left: 8px;
			display: flex;
			align-items: center;
			div.icon {
				display: grid;
				place-items: center;
				margin: 0 calc($padding - 8px);
				transform: scale(1.5);
			}
		}
		button#gl {
			background: #ff9191;
		}
		button#fb {
			background: #99b0ff;
		}
		button#em {
			background: #99d6ff;
		}
	}

	p {
		font-family: typography.$varela-round;
		margin-bottom: 16px;
		color: typography.$on-background-varient;
		&.login-prompt {
			position: absolute;
			bottom: 8px;
			left: 50%;
			transform: translateX(-50%);
			white-space: nowrap;
		}
	}
</style>
