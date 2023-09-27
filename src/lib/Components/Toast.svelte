<script lang="ts">
	import { toast } from '$lib/stores';
	import { onDestroy } from 'svelte';
	import { fly } from 'svelte/transition';

	export let duration = 2400; // in miliseconds
	export let isVisible = false;
	export let content = '';

	let timeout;

	const unsubscribe = toast.subscribe((text) => {
		if (text == '') return;
		if (isVisible) {
			isVisible = false;
			clearTimeout(timeout);
			setTimeout(() => show(text), 400);
			return;
		}
		show(text);
	});

	function show(text: string): void {
		isVisible = true;
		content = text;
		timeout = setTimeout(() => {
			isVisible = false;
		}, duration);
	}

	onDestroy(unsubscribe);
</script>

{#if isVisible}
	<div class="container" transition:fly={{ y: 32 }}>
		<p transition:fly={{ y: 12 }}>
			{content}
		</p>
	</div>
{/if}

<style lang="scss">
	@use '$lib/styles/typography';
	div.container {
		z-index: 20001;
		position: fixed;
		bottom: 72px;
		left: 50%;
		transform: translateX(-50%);
		background: #f8f9ff;
		padding: 16px 24px;
		max-width: 120px;
		border-radius: 1em;
		word-wrap: break-word;
		box-shadow: 0 8px 16px 1px #00000022;
		p {
			margin: 0;
			font-size: 14px;
			font-family: typography.$varela-round;
			color: typography.$on-background;
		}
	}
</style>
