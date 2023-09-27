<script lang="ts">
	import { fly } from 'svelte/transition';
	/*
  TODO: Refine This
  */
	export let duration = 300;
	export let key: string;
</script>

{#key key}
	<div
		in:fly={{ x: -200, duration, delay: duration }}
		out:fly={{ x: 200, duration }}
	>
		<slot />
	</div>
{/key}
