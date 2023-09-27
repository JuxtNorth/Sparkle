<script lang="ts">
	import { goto } from '$app/navigation';
	import { Avatar } from '$lib/Components';

	export let displayName: string;
	export let username: string;
	export let photoURL: string;
	//	export let uid: string;

	function handleClick() {
		goto('/chatlist/new-chat/' + username);
	}
</script>

<button on:click={handleClick}>
	<div class="avatar">
		<Avatar url={photoURL} />
	</div>
	<div class="info">
		<p class="displayName">{displayName}</p>
		<p class="username">@{username}</p>
	</div>
</button>

<style lang="scss">
	@use '$lib/styles/button';
	@use '$lib/styles/typography';
	@use '$lib/styles/balance';

	button {
		@include button.base();
		@include button.big();
		display: flex;
		justify-content: left;
		align-items: center;
		color: typography.$on-background;
		div.avatar {
			aspect-ratio: 1 / 1;
			height: 60%;
			border-radius: 50%;
			background: #ea6b6b;
			margin: 0 balance.$spacing;
		}
		div.info {
			height: calc(72px - balance.$spacing * 2);
			text-align: left;
			display: flex;
			flex-direction: column;
			justify-content: center;
			p {
				margin: 0;
			}
			p.displayName {
				font-family: typography.$comfortaa;
				font-weight: 600;
				font-size: 1rem;
				color: #444;
			}
			p.username {
				font-family: typography.$varela-round;
				font-size: 0.8rem;
				color: #777;
			}
		}
	}
</style>
