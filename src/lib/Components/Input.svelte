<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	export let autocomplete = 'off';
	export let name = '';
	export let placeholder = '';
	export let required = true;
	export let type: 'password' | 'text' | 'number' | 'email' = 'text';
	export let pre = '';
	export let value = '';

	const dispatch = createEventDispatcher();

	function handleInput(event: InputEvent) {
		value = event.target.value;

		dispatch('input', {
			value: value,
			event: event
		});
	}

	function handleFocus(event: FocusEvent) {
		dispatch('focus', {
			event: event
		});
	}

	$: value = pre;

	let self: HTMLInputElement;

	$: {
		if (self && self.value !== undefined) {
			self.value = pre;
		}
	}
</script>

<div class="input-field-container">
	{#if $$slots.icon}
		<div class="icon1">
			<slot name="icon" />
		</div>
	{/if}
	<input
		class="text-input-primary"
		style="padding-left: {$$slots.icon ? '64px' : '32px'}"
		bind:this={self}
		{autocomplete}
		{name}
		{placeholder}
		{required}
		{type}
		on:input={handleInput}
		on:focus={handleFocus}
	/>
	{#if $$slots.icon2}
		<div class="icon2">
			<slot name="icon2" />
		</div>
	{/if}
</div>

<style lang="scss">
	@mixin icon {
		position: absolute;
		display: grid;
		place-items: center;
		color: #444;
	}

	div.input-field-container {
		width: 100%;
		display: flex;
		align-items: center;
		margin-bottom: 12px;
		div.icon1 {
			@include icon();
			margin-left: 24px;
		}
		div.icon2 {
			@include icon();
			margin-right: 24px;
			right: 12px;
		}
		input.text-input-primary {
			box-sizing: border-box;
			background: #ebebeb;
			color: #444;
			font-size: 18px;
			height: 72px;
			width: 100%;
			border: none;
			border-radius: 1.4rem;
			padding-left: 32px;
			&::placeholder {
				color: #888;
			}
			&:focus {
				outline: 2px solid #83aeff;
			}
		}
	}
</style>
