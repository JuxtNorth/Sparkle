<script>
	import * as Components from '$lib/Components';
	import * as Icons from '$lib/Icons';
	import { ripple } from '$lib/Effects';
	import { fade } from 'svelte/transition';
	import { onMount } from 'svelte';
	import firebaseApp from '$lib/firebaseInit.ts';
	import { getAuth, signOut } from 'firebase/auth';
	import {
		goto,
		beforeNavigate,
		afterNavigate
	} from '$app/navigation';
	import {
		getFirestore,
		doc,
		getDoc
	} from 'firebase/firestore';
	import { fly } from 'svelte/transition';
	import {
		isChatOpen,
		selfUsername
	} from '$lib/stores';
	import {
		setProfilePicture,
		getProfilePicture,
		statePresence
	} from '$lib/Utils';

	export let data;

	const db = getFirestore(firebaseApp);

	async function getUsername(uid) {
		if ($selfUsername) {
			return $selfUsername;
		}
		try {
			const usernameRef = doc(db, `users/${uid}`);
			const usernameDoc = await getDoc(usernameRef);
			if (usernameDoc.exists()) {
				$selfUsername = usernameDoc.data().username;
				return $selfUsername;
			}
			throw new Error(
				'Undefined User with uid: ' + uid
			);
		} catch (error) {
			console.error(error);
		}
	}

	// State that client is online, auto changes to false on disconnect.
	getUsername(data.self.uid).then((username) => {
		statePresence(username);
	});

	const auth = getAuth(firebaseApp);

	let screen = 0,
		isNewChatButtonVisible = true,
		chatID = '',
		username = '';

	function openChat({ detail }) {
		isChatOpen.set(true);
		chatID = detail.chatLoc;
		username = detail.username;
	}

	afterNavigate(() => {
		setTimeout(() => {
			isNewChatButtonVisible = true;
		}, 600);
	});

	beforeNavigate(
		() => (isNewChatButtonVisible = false)
	);

	const path = `users/${data.self.uid}/chats`;

	setProfilePicture(data.self);
</script>

{#if !$isChatOpen}
	<header>
		<h1>Sparkle</h1>
		<Components.Avatar
			url={data.self.photoURL}
			on:click={() => signOut(auth)}
		/>
	</header>

	<section class="navigation">
		<button
			on:click={() => (screen = 0)}
			class:selected={screen === 0}
			use:ripple
		>
			Chats
		</button>
		<button
			on:click={() => (screen = 1)}
			class:selected={screen === 1}
			use:ripple
		>
			Calls
		</button>
	</section>

	{#if screen === 0}
		<section class="chat-list">
			<div class="header">
				<h2>Your Chats</h2>
				<button
					class="requests"
					use:ripple={{ color: '#00000033' }}
					on:click={() => goto('/chatlist/requests')}
				>
					Requests
				</button>
			</div>
			<div class="chats">
				<Components.FireCollection
					let:data
					{path}
					firestore={db}
				>
					{#each data as doc}
						<Components.ChatButton
							username={doc.ref.id}
							chatID={doc.id}
							on:click={openChat}
						/>
					{/each}
				</Components.FireCollection>
			</div>
		</section>
	{/if}

	{#if isNewChatButtonVisible}
		<button
			class="new-chat"
			use:ripple={{ color: '#00000033' }}
			in:fade
			on:click={() => goto('/chatlist/find')}
		>
			<Icons.Message size="1.5rem" />
		</button>
	{/if}
{:else}
	<div
		class="chat-window"
		in:fly={{ x: '100vw', duration: 250 }}
		out:fly={{ x: '100vw', duration: 600 }}
	>
		<Components.Chat {chatID} {username} />
	</div>
{/if}

<style lang="scss">
	@use '$lib/styles/button';
	@use '$lib/styles/typography';
	@use '$lib/styles/balance';

	div.chat-window {
		height: 100vh;
		width: 100vw;
		background: #f4f6ff;
		z-index: 20000;
		position: fixed;
		top: 0;
	}

	header,
	section {
		padding: 0 balance.$spacing;
	}

	header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		h1 {
			font-family: typography.$comfortaa;
			font-weight: 600;
		}
	}

	section.navigation {
		@include button.floating-sticky-top();
		display: flex;
		gap: calc(balance.$spacing / 2);
		button {
			@include button.base();
			@include button.primary();
			font-family: typography.$mulish;
			font-weight: 600;
			font-size: typography.$tiny;
			color: typography.$on-background;
			box-shadow: 0 6px 24px 0 #00000015;
			transition: all 0.2s ease;
		}
		button.selected {
			color: #fff;
			background: #2c2c43;
			box-shadow: none;
		}
	}

	section.chat-list {
		div.header {
			margin-top: balance.$spacing;
			display: flex;
			justify-content: space-between;
			align-items: center;
			h2 {
				font-family: typography.$comfortaa;
				font-weight: 500;
			}
			button.requests {
				@include button.base();
				@include button.secondary();
				box-shadow: 0 0 12px 0 #00000009;
			}
		}
		div.chats {
			display: flex;
			flex-direction: column;
			align-items: center;
			gap: calc(balance.$spacing / 2);
		}
	}

	button.new-chat {
		@include button.base();
		@include button.floating-bottom-right();
		padding-top: 3px;
		color: #2c2c43;
		box-shadow: 0 6px 24px 0 #00000015;
	}
</style>
