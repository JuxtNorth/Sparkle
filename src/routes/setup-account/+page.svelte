<script lang="ts">
	/*
    TODO: - Refactor this.
          - Add support for changing profile picture.
  */
	import { onMount } from 'svelte';
	import * as Icons from '$lib/Icons';
	import { Input } from '$lib/Components';
	import { ripple } from '$lib/Effects';
	import { goto } from '$app/navigation';
	import firebaseApp from '$lib/firebaseInit.ts';
	import { firebaseUser as user } from '$lib/stores';
	import type { User } from 'firebase/auth';
	import { getAuth, signOut, updateProfile } from 'firebase/auth';
	import { getFirestore, getDoc, doc, writeBatch } from 'firebase/firestore';
	import { debounce } from '$lib/Utils';

	const db = getFirestore(firebaseApp);

	function goBack(): void {
		const auth = getAuth(firebaseApp);
		signOut(auth);
		goto('/signup');
	}

	let username = '',
		state = '',
		exists = false;

	async function setupProfile(): Promise<void> {
		if (!$user) return;
		if (username.length === 0) return;
		await commitUsername();
	}

	const validateUsername = debounce(async (value) => {
		if (value.length >= 3 && value.length <= 15) {
			const ref = doc(db, 'usernames', value);
			const _doc = await getDoc(ref);
			exists = _doc.exists();
		}
	});

	function handleInput(e: CustomEvent): void {
		const value = e.detail.value.trim();
		validateUsername(value.toLowerCase());
	}

	async function commitUsername(): Promise<void> {
		if (state.length !== 0) return;

		username = username.toLowerCase().trim();

		const { uid, displayName } = <User>$user;

		const userDoc = doc(db, 'users', uid);
		const unameDoc = doc(db, 'usernames', username);

		const batch = writeBatch(db);
		batch.set(userDoc, {
			username,
			displayName: displayName
		});
		batch.set(unameDoc, { uid: uid });

		try {
			await batch.commit();
			goto('/chatlist');
		} catch {
			// Show an error.
		}
	}

	function updateUsernameState(username: string, exists: boolean): string {
		username = username.trim();

		let state = '';

		if (username.length === 0) {
			state = 'Username cannot be empty.';
		} else if (username.length < 3) {
			state = 'Username must be atleast 3 characters.';
		} else if (username.length > 15) {
			state = 'Username must have less than 15 characters.';
		}

		const regexNoSymbols = /^[A-Za-z0-9_-]*$/;
		const isValid = username.match(regexNoSymbols);

		if (!isValid) {
			state = 'Username must not include any special characters.';
		}

		return state;
	}

	$: state = updateUsernameState(username, exists);
</script>

<button class="back" on:click={goBack}>
	<Icons.AngleLeft />
</button>

<main>
	<h1>
		Setup your <br />
		Profile
	</h1>
	<div class="dp">
		<p>+</p>
	</div>
	<p>Add a profile picture</p>
	<form>
		<Input placeholder="Enter a username" bind:value={username} on:input={handleInput}>
			<Icons.User slot="icon" size="1.2em" />
		</Input>
		{#if state.length > 0}
			<p>{state}</p>
		{:else if exists}
			<p>Username already exists.</p>
		{/if}
		<button class="continue" use:ripple on:click={setupProfile}>Continue</button>
	</form>
</main>

<style lang="scss">
	@use '$lib/styles/button';
	@use '$lib/styles/typography';
	@use '$lib/styles/balance';

	button.back {
		@include button.base();
		@include button.iconed-big();
		background: #d2d2d2;
		margin-top: balance.$spacing;
		margin-left: balance.$spacing;
	}

	main {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: balance.$spacing;
		margin-top: 16px;
		h1 {
			margin-top: 8px;
			margin-right: auto;
			font-family: typography.$comfortaa;
			font-weight: 300;
			font-size: typography.$header;
			color: typography.$on-background;
		}
		form {
			width: 100%;
			:global(input[type='text']) {
				text-transform: lowercase;
				&::placeholder {
					text-transform: none;
				}
			}
		}
		div.dp {
			height: 192px;
			width: 192px;
			border: 2px solid #9f5cff;
			border-radius: 50%;
			display: grid;
			place-items: center;
			p {
				font-size: typography.$big;
				color: #9f5cff;
				transform: translateY(3px);
			}
		}
		p {
			font-family: typography.$comfortaa;
			font-weight: 600;
			color: #666;
			margin-bottom: 24px;
		}
	}

	button.continue {
		@include button.base();
		@include button.big();
		font-size: typography.$mid;
		background: linear-gradient(90deg, #7c3df5, #3d4cf5);
		color: white;
		font-family: typography.$varela-round;
	}
</style>
