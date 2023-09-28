<script lang="ts">
	import * as Icons from '$lib/Icons';
	import { Avatar } from '$lib/Components';
	import { ripple } from '$lib/Effects';
	import { fly } from 'svelte/transition';
	import { createEventDispatcher, onMount } from 'svelte';
	import type { Peer } from 'peerjs';
	import { getFirestore, onSnapshot, query, orderBy, doc, updateDoc } from 'firebase/firestore';
	import firebaseApp from '$lib/firebaseInit.ts';
	import {
		getFirebaseUser,
		getUserMedia,
		getPeerInstance,
		Timer,
		getProfilePicture,
		getMediaStreamer
	} from '$lib/Utils';
	import { goto } from '$app/navigation';
	import {
		peerMediaCall,
		localStream,
		remoteStream,
		inCallWith,
		callState,
		selfUsername,
		toast
	} from '$lib/stores';
	import { get as readStore } from 'svelte/store';

	let promptMinimised = false;
	let timerString = '00 : 00';
	let selfMuted = false;
	let caleePhotoURL;

	const timer = new Timer((timestamp) => {
		timerString = timestamp;
	});

	let state: 'calling' | 'call-recieved' | 'call-accepted' | null;

	let audioElem: HTMLAudioElement;

	let callResolve;

	const firestore = getFirestore(firebaseApp);
	const streamer = getMediaStreamer();

	onMount(async () => {
		const self = await getFirebaseUser();
		const userRef = doc(firestore, `users/${self.uid}`);
		streamer.on('open', (id) => {
			updateDoc(userRef, {
				peerConnectionID: id
			});
		});

		streamer.on('request', async (origin, call) => {
			if (origin === 'bySelf') {
				$callState = 'calling';
				return;
			}
			if (origin === 'toSelf') {
				$callState = 'call-recieved';
				const response = await new Promise((res) => {
					callResolve = res;
				});
				callResolve = null;
				return response;
			}
		});

		streamer.on('reject', () => {
			toast.set('Call Ended');
			$callState = null;
		});

		streamer.on('accept', (remoteStream) => {
			$callState = 'call-accepted';
			timer.reset().play();
			audioElem.srcObject = remoteStream;
			audioElem.play();
			minimisePrompt();
		});

		streamer.on('close', () => {
			toast.set('Call Ended');
			$callState = null;
		});
	});

	function toggleMuteState(): void {
		selfMuted = selfMuted ? false : true;
	}

	function minimisePrompt(delay = 3600): void {
		setTimeout(() => {
			promptMinimised = true;
		}, delay);
	}

	function maximisePrompt(duration = 3600): void {
		promptMinimised = false;
		setTimeout(() => {
			promptMinimised = true;
		}, duration);
	}

	const dispatch = createEventDispatcher();

	function accept(): string {
		dispatch('accept');
		if (callResolve) callResolve(true);
	}

	function reject(): string {
		dispatch('reject');
		if (callResolve) {
			callResolve(false);
			return;
		}
	}

	$: if ($inCallWith?.length > 0)
		getProfilePicture($inCallWith).then((url) => (caleePhotoURL = url));
</script>

<audio bind:this={audioElem} />

{#if promptMinimised && $callState == 'call-accepted'}
	<button
		class="top-bar"
		on:click={() => maximisePrompt()}
		in:fly={{ y: -56, delay: 200 }}
		out:fly={{ y: -56 }}
	>
		<p>{timerString} - Call with {$inCallWith}</p>
	</button>
{/if}

{#if $callState && !promptMinimised}
	<div class="container" in:fly={{ y: -200 }} out:fly={{ y: -200 }}>
		<div class="avatar">
			<Avatar url={caleePhotoURL} size="64px" />
		</div>
		{#if $callState === 'call-recieved'}
			<div class="title">
				<p class="info">You have a call from</p>
				<p class="name">{$inCallWith}</p>
			</div>
			<div class="buttons">
				<button id="reject" use:ripple on:click={reject}>
					<Icons.Phone size="1.6em" />
				</button>
				<button id="accept" use:ripple on:click={accept}>
					<Icons.Phone size="1.6em" />
				</button>
			</div>
		{:else}
			{#if $callState === 'call-accepted'}
				<div class="title">
					<p class="name">{$inCallWith}</p>
					<p class="info">{timerString}</p>
				</div>
			{:else if $callState === 'calling'}
				<div class="title">
					<p class="info">Calling...</p>
					<p class="name">{$inCallWith}</p>
				</div>
			{/if}
			<div class="buttons">
				<button id="reject" on:click={() => streamer.endCall()} use:ripple>
					<Icons.Phone size="1.6em" />
				</button>
				<button id="mute" use:ripple on:click={toggleMuteState}>
					{#if selfMuted}
						<Icons.Mute size="1.85em" />
					{:else}
						<Icons.Microphone size="1.6em" />
					{/if}
				</button>
			</div>
		{/if}
	</div>
{/if}

<style lang="scss">
	@use '$lib/styles/balance';
	@use '$lib/styles/button';
	@use '$lib/styles/typography';

	button.top-bar {
		height: 28px;
		width: 100vw;
		top: 0;
		background: #6cff6c;
		border: none;
		display: flex;
		align-items: center;
		padding-left: balance.$spacing;
		p {
			font-size: 14px;
			font-family: typography.$varela-round;
			color: #ffffff;
		}
	}

	div.container {
		height: 96px;
		width: 95vw;
		background: #fff;
		position: absolute;
		top: balance.$spacing;
		left: 50%;
		transform: translate(-50%);
		border-radius: 24px;
		z-index: 99999;
		box-shadow: 0 12px 24px #00000022;
		display: flex;
		align-items: center;
		div.avatar {
			height: 64px;
			width: 64px;
			margin: balance.$spacing;
		}
		div.title {
			height: 64px;
			text-align: left;
			display: flex;
			flex-direction: column;
			justify-content: center;
			p {
				margin: 0;
				&.info {
					font-family: typography.$comfortaa;
					font-weight: 600;
					font-size: 0.8rem;
					color: #888;
				}
				&.name {
					font-family: typography.$varela-round;
					font-size: 1.4rem;
					color: typography.$on-background;
				}
			}
		}
		div.buttons {
			margin-left: auto;
			margin-right: balance.$spacing;
			display: flex;
			gap: 8px;
			button {
				@include button.base;
				color: #fff;
				height: 58px;
				width: 58px;
				border-radius: 50%;
				&#reject {
					background: orangered;
					transform: rotate(135deg);
				}
				&#accept {
					background: lime;
				}
				&#mute {
					background: #797791;
				}
			}
		}
	}
</style>
