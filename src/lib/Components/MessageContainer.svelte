<svelte:options accessors />

<script lang="ts">
	import { beforeUpdate, afterUpdate, onMount, createEventDispatcher } from 'svelte';
	import Message from './Message.svelte';
	import {
		getFirestore,
		doc,
		getDoc,
		query as firestoreQuery,
		orderBy,
		limit,
		collection
	} from 'firebase/firestore';
	import { getFirebaseUser } from '$lib/Utils';
	import firebaseApp from '$lib/firebaseInit.ts';
	import { FireCollection } from '$lib/Components';

	export let chatID: string;
	export let username: string; // of other person

	// Auto-scroll
	/*
    TODO: - No scroll on virtual keyboard toggle.
          - Scroll on send.
          - Scroll on resize after send.
  */
	let self: HTMLDivElement, bottom: HTMLDivElement, autoscroll: boolean;

	function scrollToBottom(): void {
		if (self) {
			self.scrollTo(0, self.scrollHeight);
		}
	}

	beforeUpdate(() => {
		autoscroll = self && self.offsetHeight + self.scrollTop > self.scrollHeight - 20;
	});

	afterUpdate(() => {
		scrollToBottom();
	});

	const path = `chats/${chatID}/messages`;
	const firestore = getFirestore(firebaseApp);
	const query = firestoreQuery(collection(firestore, path), orderBy('timestamp'), limit(25));

	onMount(async () => {
		setTimeout(() => scrollToBottom(), 560);
	});

	const dispatch = createEventDispatcher();

	function handleSnapshot(event) {
		dispatch('snapshot', event.detail);
		setTimeout(() => scrollToBottom(), 100);
	}
</script>

<FireCollection {query} on:snapshot={handleSnapshot} let:data {firestore} {path}>
	<div class="messages" bind:this={self}>
		{#each data as { content, sender }}
			<Message {content} {sender} self={sender !== username} />
		{/each}
	</div>
</FireCollection>

<style lang="scss">
	@use '$lib/styles/balance';

	.messages {
		overflow-y: auto;
		overflow-x: hidden;
		flex-grow: 1;
		padding-left: balance.$spacing;
		padding-right: balance.$spacing;
		scroll-behavior: smooth;
	}
</style>
