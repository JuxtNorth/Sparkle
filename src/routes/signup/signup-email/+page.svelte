<script lang="ts">
	import * as Icons from '$lib/Icons';
	import { ripple } from '$lib/Effects';
	import { Input, Strength } from '$lib/Components';
	import { goto } from '$app/navigation';
	import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';

	let isPasswordVisible = false;

	function togglePasswordVisibility() {
		isPasswordVisible = isPasswordVisible ? false : true;
	}

	const auth = getAuth();

	let password, email;

	function checkPasswordStrength(e: CustomEvent): void {
		password = e.detail.value;
	}

	async function createAccount() {
		if (password.length < 8) {
			alert('Password must be atleast 8 characters long.');
		}

		try {
			const credential = await createUserWithEmailAndPassword(auth, email, password);
			goto('/signin');
		} catch (error) {
			alert('User already exists');
			console.error(error);
		}
	}
</script>

<button class="back" on:click={() => goto('/signup')}>
	<Icons.AngleLeft />
</button>

<main>
	<h1>
		Signup with <br />
		Email
	</h1>
	<form autocomplete="on">
		<Input
			placeholder="Enter your email"
			type="email"
			name="email"
			autocomplete="no"
			bind:value={email}
		>
			<Icons.Email slot="icon" size="1.4em" />
		</Input>
		<Input
			placeholder="Enter a password"
			type={isPasswordVisible ? 'text' : 'password'}
			name="password"
			autocomplete="new-password"
			on:input={checkPasswordStrength}
		>
			<Icons.Lock slot="icon" size="1.4em" />
			<button class="icon" slot="icon2" on:click={togglePasswordVisibility}>
				<Icons.Eye size="28px" active={isPasswordVisible} />
			</button>
		</Input>
		<Strength {password} />
		<button class="create" use:ripple on:click={createAccount}>Create an account</button>
	</form>
</main>

<style lang="scss">
	@use '$lib/styles/button';
	@use '$lib/styles/typography';

	$padding: 16px;

	button.back {
		@include button.base();
		@include button.iconed-big();
		background: #d2d2d2;
		margin-top: $padding;
		margin-left: $padding;
	}

	button.icon {
		padding: 0;
		background: transparent;
		border: none;
	}

	main {
		display: flex;
		flex-direction: column;
		align-items: center;
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
		form {
			width: 100%;
			p.warning {
				font-family: typography.$comfortaa;
				margin-left: 8px;
			}
		}
	}

	button.create {
		@include button.base();
		@include button.big();
		font-family: typography.$varela-round;
		font-size: 18px;
		color: white;
		background: linear-gradient(90deg, #7c3df5, #3d4cf5);
	}
</style>
