<script lang="ts">
	import { Avatar } from '$lib/Components';
	import * as Icons from '$lib/Icons';
	import { ripple } from '$lib/Effects';
	import { goto } from '$app/navigation';
	import {
		createEventDispatcher,
		onMount,
		onDestroy
	} from 'svelte';
	import {
		getFirestore,
		collection,
		query,
		where,
		getDocs
	} from 'firebase/firestore';
	import firebaseApp from '$lib/firebaseInit.ts';
	import {
		call,
		getProfilePicture,
		checkPresence,
		getMediaStreamer,
		type MediaType
	} from '$lib/Utils';
	import {
		inCallWith,
		peerMediaCall,
		callState,
		toast
	} from '$lib/stores';
	import { fly } from 'svelte/transition';

	export let username: string;
	export let showCallButtons = true;

	let isOnline = false;

	const unsubscribe = checkPresence(username, (v) => {
		isOnline = v;
	});

	onDestroy(() => {
		unsubscribe();
	});

	const streamer = getMediaStreamer();

	const db = getFirestore(firebaseApp);
	const usersRef = collection(db, 'users');
	const q = query(
		usersRef,
		where('username', '==', username)
	);

	async function getPeerID(): Promise<void | string> {
		const userDoc = await getDocs(q);
		const { peerConnectionID } = userDoc.docs[0].data();
		if (peerConnectionID) {
			return peerConnectionID;
		} else {
			throw new Error('Failed to fetch peerID');
		}
	}

	async function placeCall(
		type: MediaType
	): Promise<void> {
		if (!isOnline) {
			toast.set(''); // Won't update without this.
			toast.set('User is offline');
			return;
		}
		const remotePeerID = await getPeerID();
		streamer.placeCall(remotePeerID, username, 'voice');
	}

	const rippleProps = {
		color: '#00000077',
		duration: 400
	};

	let profileURL: string;

	getProfilePicture(username).then((url) => {
		profileURL = url;
	});

	const dispatch = createEventDispatcher();

	function handleClose() {
		dispatch('close');
	}
</script>

<div class="container">
	<button
		class="back"
		use:ripple={rippleProps}
		on:click={() => dispatch('close')}
	>
		<Icons.ArrowLeft />
	</button>
	<Avatar url={profileURL} />
	<div class="info">
		<div id="name">{username}</div>
		<div class="status">
			<div class="dot" class:active={isOnline} />
			{#if isOnline}
				<p
					in:fly={{ y: -10, delay: 100 }}
					out:fly={{ y: -10, duration: 100 }}
				>
					online
				</p>
			{:else}
				<p
					in:fly={{ y: 10, delay: 100 }}
					out:fly={{ y: 10, duration: 100 }}
				>
					offline
				</p>
			{/if}
		</div>
	</div>
	<div id="btns">
	  {#if showCallButtons}
		<button class="video" use:ripple={rippleProps}>
			<Icons.Video />
		</button>
		<button
			class="voice"
			on:click={() => placeCall('voice')}
			use:ripple={rippleProps}
		>
			<Icons.Phone />
		</button>
		{/if}
		<button class="menu" use:ripple={rippleProps}>
			<Icons.EllipsisVertical />
		</button>
	</div>
</div>

<style lang="scss">
	@use '$lib/styles/button';
	@use '$lib/styles/typography';
	@use '$lib/styles/balance';

	$chatHeaderHeight: 72px;

	.container {
		$rounding: 24px;
		height: $chatHeaderHeight;
		width: 100%;
		background: #fff;
		display: flex;
		align-items: center;
		flex-shrink: 0;
		border-bottom-left-radius: $rounding;
		border-bottom-right-radius: $rounding;
		button {
			@include button.base();
			@include button.iconed();
			background: transparent;
			font-size: typography.$mid;
			color: typography.$on-background;
		}
		button.back {
			margin-left: 4px;
		}
		div.info {
			font-family: typography.$varela-round;
			padding-left: balance.$spacing;
			div.status {
				display: flex;
				align-items: center;
				div.dot {
					height: 10px;
					width: 10px;
					margin-right: 4px;
					border-radius: 50%;
					background: #f65c3d;
					transition: all 0.2s ease;
					&.active {
						background: #3ffa36;
					}
				}
				p {
					margin: 0;
				}
			}
		}
		#btns {
			display: flex;
			justify-content: space-between;
			margin-left: auto;
			button.voice {
				font-size: 18px;
			}
			button.menu {
				font-size: 20px;
			}
		}
	}
</style>
