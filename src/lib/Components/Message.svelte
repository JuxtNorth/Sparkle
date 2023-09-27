<svelte:options accessors />

<script lang="ts">
	import { Avatar } from '$lib/Components';
	import { getProfilePicture } from '$lib/Utils';

	export let content: string[];
	export let sender: string;
	export let self = false;

	let photoURL;

	async function getPhotoURL() {
		photoURL = await getProfilePicture(sender);
	}

	getPhotoURL();
</script>

<div class="container" class:self>
	<div class="avatar">
		<Avatar url={photoURL} size="36px" />
	</div>
	<div class="messages">
		{#each content as message}
			<div class="message">{message}</div>
			<br />
		{/each}
	</div>
</div>

<style lang="scss">
	@use '$lib/styles/typography';

	div.container {
		display: flex;
		justify-content: left;
		width: auto;
		max-width: 68vw;
		margin-top: 12px;
		margin-left: 0;
		justify-content: left;
		div.avatar {
			flex-shrink: 0;
			order: 0;
			margin-right: 12px;
		}
		div.messages {
			text-align: left;
			order: 1;
			text-align: left;
			div.message {
				display: inline-block;
				margin-bottom: 8px;
				padding: 12px;
				border-radius: 16px;
				background: white;
				color: #4e4e4e;
				font-family: typography.$varela-round;
				text-align: left;
			}
		}
	}

	// Override
	div.self {
		margin-left: auto;
		justify-content: right;
		div.avatar {
			order: 1;
			margin-left: 12px;
		}
		div.messages {
			order: 0;
			text-align: right;
		}
	}
</style>
