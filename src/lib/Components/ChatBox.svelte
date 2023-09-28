<script lang="ts">
	import { fly } from 'svelte/transition';
	import { createEventDispatcher } from 'svelte';
	import { ripple } from '$lib/Effects';
	import * as Icons from '$lib/Icons';
	import { onMount, onDestroy } from 'svelte';

	/*https://codepen.io/nandai/pen/LRxRxK*/
	let ta_frame: HTMLDivElement;
	let ta: HTMLTextAreaElement;

	function resize(): void {
		setTimeout(() => {
			if (ta === null) return;
			ta.style.cssText = 'height: 0px';

			const h = Math.min(20 * 5, ta.scrollHeight);

			ta_frame.style.cssText = `height: ${h}px;`;
			ta.style.cssText = `height: ${h}px;`;
		}, 0);
	}

	export let isVisible = false;

	onMount(async () => {
		await new Promise((res) => setTimeout(res, 300));
		isVisible = true;
		resize();
	});

	onDestroy(() => (isVisible = false));

	let value = '';

	const dispatch = createEventDispatcher();

	function send(): void {
		if (value.trim().length === 0) return;
		ta.focus();
		dispatch('send', {
			message: value
		});
		value = '';
		resize();
	}
</script>

{#if isVisible}
	<div class="container" in:fly={{ y: 50, duration: 100 }} out:fly={{ y: 50, duration: 100 }}>
		<div class="main">
			<div class="text-area-container" bind:this={ta_frame}>
				<textarea rows="1" placeholder="Message" on:keydown={resize} bind:value bind:this={ta} />
			</div>
			<button
				id="attachment-btn"
				use:ripple={{
					color: '#00000077',
					duration: 700
				}}
			>
				<Icons.PaperClip />
			</button>
		</div>
		<button id="send-btn" on:click={send}>
			{#if value.trim().length === 0}
				<div id="mic" in:fly={{ duration: 80, y: -20 }} out:fly={{ duration: 80, y: -20 }}>
					<Icons.Microphone />
				</div>
			{:else}
				<div id="send" in:fly={{ duration: 80, y: 20 }} out:fly={{ duration: 80, y: 20 }}>
					<Icons.Send />
				</div>
			{/if}
		</button>
	</div>
{/if}

<style lang="scss">
	@use '$lib/styles/button';
	@use '$lib/styles/typography';
	@use '$lib/styles/balance';

	$chatBoxHeight: 54px;
	$rounding: 16px;
	$sizeOffset: 3px; // TODO: This shouldn't exist.

	div.container {
		//  flex-shrink: 0;
		margin: 0 auto;
		width: calc(100vw - balance.$spacing * 2);
		display: flex;
		justify-content: space-between;
		margin-bottom: balance.$spacing;
		div.main {
			width: calc(100% - $chatBoxHeight - balance.$spacing);
			border-radius: $rounding;
			background: white;
			display: flex;
			#attachment-btn {
				margin-left: auto;
			}
			div.text-area-container {
				$padding: 27px - 8px;
				margin: 0;
				padding: $padding $padding;
				width: 70%;
				height: $padding * 2;
				textarea {
					overflow: auto;
					width: 100%;
					height: $padding * 2;
					resize: none;
					margin: 0;
					padding: 0;
					padding-left: $sizeOffset;
					border: 0;
					font-family: 'Varela Round', Helvetica;
					font-size: typography.$tiny;
					&:focus {
						outline: none;
					}
					&::placeholder {
						color: #444444;
					}
				}
			}
		}
		button {
			@include button.base();
			background: transparent;
			height: $chatBoxHeight + $sizeOffset;
			width: $chatBoxHeight + $sizeOffset;
			border-radius: $rounding;
			font-size: typography.$mid;
			color: typography.$on-background;
			align-self: end;
		}
		button#send-btn {
			@include button.base();
			height: $chatBoxHeight + $sizeOffset;
			width: $chatBoxHeight + $sizeOffset;
			border-radius: $rounding;
			background: #5c9bff;
			color: white;
			align-self: end;
			#send,
			#mic {
				height: 1em;
				width: 1em;
				position: fixed;
			}
			#send {
				z-index: 0;
				padding-left: 3px;
			}
			#mic {
				z-index: 1;
			}
		}
	}
</style>
