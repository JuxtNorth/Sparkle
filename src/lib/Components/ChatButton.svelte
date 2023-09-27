<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import {
		getLastMessage,
		limitString,
		getProfilePicture
	} from '$lib/Utils';
	import { getFirestore } from 'firebase/firestore';
	import firebaseApp from '$lib/firebaseInit.ts';
	import { createEventDispatcher } from 'svelte';
	import { Avatar } from '$lib/Components';

	export let username: string;
	export let chatID: string;

	let lastMessage = '',
		photoURL: string;

	const db = getFirestore(firebaseApp);

	onMount(async () => {
		lastMessage = await getLastMessage(db, chatID);
		photoURL = await getProfilePicture(username);
	});

	const dispatch = createEventDispatcher();

	function handleClick(event: PointerEvent): void {
		dispatch('click', {
			event,
			chatLoc: chatID,
			username: username
		});
	}
</script>

<button on:click={handleClick}>
	<div class="avatar">
		<Avatar url={photoURL} />
	</div>
	<div class="info">
		<p class="username">{username}</p>
		<p class="last-message">
			{lastMessage}
		</p>
	</div>
</button>

<style lang="scss">
	@use '$lib/styles/button';
	@use '$lib/styles/balance';
	@use '$lib/styles/typography';

	button {
		@include button.base();
		@include button.big();
		display: flex;
		justify-content: left;
		align-items: center;
		color: typography.$on-background;
		div.avatar {
			margin: 0 balance.$spacing;
		}
		div.info {
			height: 72px - balance.$spacing * 2;
			text-align: left;
			display: flex;
			flex-direction: column;
			justify-content: center;
			p {
				margin: 0;
			}
			p.username {
				font-family: typography.$comfortaa;
				font-weight: 600;
				font-size: 1rem;
				color: typography.$on-background;
			}
			p.last-message {
				font-family: typography.$varela-round;
				font-size: 0.8rem;
				color: #777;
			}
		}
	}
</style>
