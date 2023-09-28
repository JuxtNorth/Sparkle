<script lang="ts">
	import { Input } from '$lib/Components';
	import * as Icons from '$lib/Icons';
	import { goto } from '$app/navigation';
	import {
		getAuth,
		signInWithEmailAndPassword,
		signInWithPopup,
		GoogleAuthProvider
	} from 'firebase/auth';
	import { ripple } from '$lib/Effects';

	let email, password;

	const auth = getAuth();

	async function signIn(): Promise<void> {
		try {
			const credential = await signInWithEmailAndPassword(auth, email, password);
			goto('/');
		} catch (error) {
			showWarning();
		}
	}

	function exit(): void {
		goto('/signup');
	}

	let warning = '';

	function showWarning(): void {
		warning = 'Invalid email or password';
	}

	function hideWarning(): void {
		warning = '';
	}

	function authWithGoogle(): void {
		const auth = getAuth();
		signInWithPopup(auth, new GoogleAuthProvider()).then(() => goto('/'));
	}
</script>

<button class="back" on:click={() => goto('/signup')}>
	<Icons.AngleLeft />
</button>

<main>
	<h1>Sign in to<br /> your Account</h1>
	<form autocomplete="on">
		<Input
			placeholder="Enter email"
			bind:value={email}
			type="email"
			name="email"
			autocomplete="no"
			on:input={hideWarning}
		>
			<Icons.Email slot="icon" size="1.5em" />
		</Input>
		<Input
			placeholder="Enter password"
			bind:value={password}
			name="password"
			autocomplete="password"
			on:input={hideWarning}
		>
			<Icons.Lock slot="icon" size="1.5em" />
		</Input>
		{#if warning.length > 0}
			<p class="warning">{warning}</p>
		{/if}
		<button on:click={signIn} use:ripple> Sign in </button>
	</form>

	<section class="continue-with">
		<h4>Or continue with</h4>
		<div class="options">
			<button id="facebook">
				<Icons.Facebook size="2.6em" />
			</button>
			<button id="google" on:click={authWithGoogle}>
				<Icons.Google size="2.6em" />
			</button>
		</div>
	</section>
</main>

<style lang="scss">
	@use '$lib/styles/button';
	@use '$lib/styles/typography';
	@use '$lib/styles/balance';

	$padding: 16px;

	button.back {
		@include button.base();
		@include button.iconed-big();
		background: #d2d2d2;
		margin-top: $padding;
		margin-left: $padding;
	}

	main {
		padding: $padding;
		margin-top: $padding;

		h1 {
			margin-top: calc($padding / 2);
			margin-right: auto;
			font-size: typography.$header;
			font-family: typography.$comfortaa;
			font-weight: 300;
			color: typography.$on-background;
		}

		form > button {
			@include button.base();
			width: 100%;
			height: 64px;
			background: linear-gradient(169deg, #5367f7, #5300b1);
			color: #d0d8e6;
			font-family: typography.$comfortaa;
			font-size: 18px;
			border-radius: 0.8em;
		}

		form > p.warning {
			font-family: typography.$varela-round;
			color: typography.$on-background;
		}

		section.continue-with {
			display: flex;
			flex-direction: column;
			align-items: center;
			h4 {
				font-family: typography.$varela-round;
				font-weight: 400;
				color: #777;
			}
			div.options {
				display: flex;
				gap: balance.$spacing;
				button {
					@include button.base();
					aspect-ratio: 1;
					height: 56px;
					border-radius: 0.8em;
					color: white;
					&#google {
						background: #ff9191;
					}
					&#facebook {
						background: #99b0ff;
					}
				}
			}
		}
	}
</style>
