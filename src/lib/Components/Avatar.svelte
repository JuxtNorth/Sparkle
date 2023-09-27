<script lang="ts">
	import { User } from '$lib/Icons';
	import { createEventDispatcher } from 'svelte';

	export let url: string;
	export let size = '42px';

	const dispatch = createEventDispatcher();

	function handleClick(event) {
		dispatch('click', { event });
	}
</script>

<button
	on:click={handleClick}
	style="height: {size}; width: {size}"
>
	{#if url != null}
		<img
			src={url}
			alt="profile-picture"
			height={size}
			width={size}
		/>
	{:else}
		<User size="60%" />
	{/if}
</button>

<style lang="scss">
	@use '$lib/styles/button';
	button {
		@include button.base();
		@include button.iconed();
		padding: 0;
		box-shadow: 0 6px 24px 0 #00000012;
		background: #dddde2;
		img {
			border-radius: 50%;
		}
	}
</style>
