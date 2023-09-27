<script lang="ts">
	import { ripple } from '$lib/Effects';
	import { onMount, onDestroy } from 'svelte';
	import {
		getFirestore,
		collection,
		query,
		orderBy,
		limit,
		getDocs,
		setDoc,
		getDoc,
		doc,
		runTransaction,
		deleteDoc,
		serverTimestamp
	} from 'firebase/firestore';
	import firebaseApp from '$lib/firebaseInit.ts';
	import {
		getFirebaseUser,
		getLastMessage
	} from '$lib/Utils';

	export let username = '';
	export let chatID = '';

	let lastMessage = '';

	const db = getFirestore(firebaseApp);

	let self;

	onMount(async () => {
		lastMessage = await getLastMessage(db, chatID);
		try {
			self = await getFirebaseUser();
		} catch (error) {
			console.error(error);
		}
	});

	async function openChat() {
		if (!self) return;
		const chatID = await runTransaction(
			db,
			async () => {
				try {
					// Get the chat ID.
					const path1 = `users/${self.uid}/requests/${username}`;
					const chatRequestRef = doc(db, path1);
					const chatRequestDoc = await getDoc(
						chatRequestRef
					);
					const { id: chatID } = chatRequestDoc.data();
					// Remove it from requests
					await deleteDoc(chatRequestRef);
					// Add id to chats
					const path2 = `users/${self.uid}/chats`;
					const chatRef = doc(db, path2, username);
					await setDoc(
						chatRef,
						{
							id: chatID,
							createdAt: serverTimestamp()
						},
						{ merge: true }
					);
					return chatID;
				} catch (error) {
					console.error(error);
				}
				goto('/chatlist/chat/' + chatID + '+chat');
			}
		);
	}
</script>

<button
	use:ripple={{ color: '#00000066' }}
	on:click={openChat}
>
	<div class="avatar" />
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
			aspect-ratio: 1;
			height: 60%;
			border-radius: 50%;
			background: #6bea7d;
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
