<script lang="ts">
	import * as Icons from '$lib/Icons';
	import * as Components from '$lib/Components';
	import {
		goto,
		beforeNavigate
	} from '$app/navigation';
	import { onMount } from 'svelte';
	import {
		getFirestore,
		collection,
		getDoc,
		query,
		onSnapshot,
		orderBy
	} from 'firebase/firestore';
	import firebaseApp from '$lib/firebaseInit.ts';
	import { getFirebaseUser } from '$lib/Utils';

	function exit(): void {
		goto('/chatlist');
	}

	const db = getFirestore(firebaseApp);

	let requests = [],
		unsubscribe;

	async function getRequests() {
		try {
			const self = await getFirebaseUser();
			const path = `users/${self.uid}/requests`;
			const requestsRef = collection(db, path);
			const q = query(
				requestsRef,
				orderBy('createdAt')
			);
			unsubscribe = onSnapshot(q, (snapshot) => {
				requests = [];
				snapshot.forEach((entry) => {
					const chatRequest = {
						username: entry.id,
						chatID: entry.data().id
					};
					requests.push(chatRequest);
				});
			});
		} catch {
			goto('/');
		}
	}

	onMount(getRequests);
	beforeNavigate(() => unsubscribe());
</script>

<header>
	<button class="back" on:click={exit}>
		<Icons.XMark />
	</button>
	<h1>Message Requests</h1>
</header>

<section class="chat-requests">
	{#each requests as request}
		<Components.ChatRequest {...request} />
	{/each}
</section>

<style lang="scss">
	@use '$lib/styles/button';
	@use '$lib/styles/typography';
	@use '$lib/styles/balance';

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
			font-size: typography.$tiny;
			margin-left: $padding;
			transform: translateY(1px);
		}
	}

	section.chat-requests {
		margin: balance.$spacing;
	}
</style>
