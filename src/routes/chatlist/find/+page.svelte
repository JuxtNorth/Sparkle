<script lang="ts">
	import * as Components from '$lib/Components';
	import * as Icons from '$lib/Icons';
	import { goto } from '$app/navigation';
	import {
		getFirestore,
		addDoc,
		getDocs,
		collection,
		query,
		orderBy,
		where
	} from 'firebase/firestore';
	import firebaseApp from '$lib/firebaseInit.ts';
	import { debounce } from '$lib/Utils';

	function exit(): void {
		goto('/chatlist');
	}

	interface Suggestion {
		displayName: string;
		username: string;
	}

	let term = '',
		suggestions: Array<Suggestion> = [];

	const db = getFirestore(firebaseApp);
	const usersRef = collection(db, 'users');

	const getSuggestions = debounce(async () => {
		if (term.length === 0) {
			suggestions = [];
			return;
		}
		term = term.trim().toLowerCase();
		const q = query(
			usersRef,
			orderBy('username'),
			where('username', '>=', term),
			where('username', '<=', term + '~')
		);
		const snapshot = await getDocs(q);
		suggestions = [];
		snapshot.forEach((doc) => {
			suggestions.push({
				...doc.data(),
				uid: doc.id
			});
		});
	}, 500);
</script>

<header>
	<button class="back" on:click={exit}>
		<Icons.XMark />
	</button>
	<h1>Find People</h1>
</header>

<main>
	<Components.Input
		placeholder="Search users"
		bind:value={term}
		on:input={getSuggestions}
	>
		<Icons.Search slot="icon" size="1.2em" />
	</Components.Input>
	<h2>Suggestions</h2>
	{#each suggestions as suggestion}
		<Components.ChatSuggestion {...suggestion} />
	{/each}
</main>

<style lang="scss">
	@use '$lib/styles/button';
	@use '$lib/styles/typography';

	$padding: 16px;

	header {
		height: 42px + $padding * 2;
		display: flex;
		align-items: center;
		justify-content: left;
		button.back {
			@include button.base();
			@include button.iconed-big();
			background: #e1e1e1;
			margin-left: $padding;
		}
		h1 {
			font-family: typography.$comfortaa;
			font-weight: 600;
			font-size: typography.$mid;
			margin-left: $padding;
			transform: translateY(1px);
		}
	}

	main {
		padding: $padding;
		display: flex;
		flex-direction: column;
		gap: $padding;
		h2 {
			font-family: typography.$comfortaa;
			font-weight: 600;
			margin: 0;
			margin-left: 4px;
		}
		:global(input[type='text']) {
			text-transform: lowercase;
			&::placeholder {
				text-transform: none;
			}
		}
	}
</style>
