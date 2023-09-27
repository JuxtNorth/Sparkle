<script lang="ts">
	import * as Icons from '$lib/Icons';
	import { Avatar } from '$lib/Components';
	export let data;
	let username = 'Kiron Dey';
	let photoURL =
		'https://lh3.googleusercontent.com/a/AAcHTtfuiMrwpqVMvsBpjbs_e3j6GFQux-hE2lmv935pnaz6Z8I=s96-c';
</script>

<main>
	<section class="caller-info">
		<Avatar url={photoURL} size="320px" />
		<p>You have a video call from</p>
		<h3>{username}</h3>
	</section>
	<section class="options">
		<button id="reject">
			<Icons.Phone />
		</button>
		<button id="accept">
			<Icons.Video />
		</button>
	</section>
</main>

<style lang="scss">
	@use '$lib/styles/button';
	@use '$lib/styles/typography';

	main {
		height: 100vh;
		background: #181818;
		section.caller-info {
			display: flex;
			flex-direction: column;
			align-items: center;
			padding-top: 32px;
			p,
			h3 {
				color: white;
				margin: 2px;
			}
			p {
				margin-top: 24px;
				font-family: typography.$varela-round;
				color: #ddd;
			}
			h3 {
				font-family: typography.$comfortaa;
				color: #fff;
			}
		}
	}
</style>
