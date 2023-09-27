<script lang="ts">
	import Progress from './Progress.svelte';
	import {
		passwordStrength,
		type Result
	} from 'check-password-strength';

	export let password = '';

	const strengthLevel = [0, 0.33, 0.66, 1];
	const colors = [
		'#ff5959',
		'#fe8a35',
		'#ffe03a',
		'#9efa5f'
	];
	const possible = [
		'uppercase',
		'lowercase',
		'number',
		'symbol'
	];

	function getPreposition(str: string): string {
		return 'aeiou'.includes(str.trim()[0]) ? 'an' : 'a';
	}

	function notIncludes(contains: string[]): string {
		let list = [];

		for (let keyword of possible) {
			if (contains.includes(keyword)) continue;

			if (
				keyword === 'uppercase' ||
				keyword === 'lowercase'
			) {
				keyword += ' letter';
			}

			keyword = getPreposition(keyword) + ' ' + keyword;

			list.push(keyword);
		}

		let out = '';

		if (list.length === 0) return out;

		if (list.length > 1) {
			out = list.slice(0, list.length - 1).join(', ');
			out = out + ' and ' + list[list.length - 1];
		} else {
			out = list[0];
		}

		return out;
	}

	function getSuggestion(strength: object): string {
		const { contains } = strength;

		const notincludes = notIncludes(contains);

		let out = '';

		if (notincludes.length) {
			out = '- Must contain ' + notincludes + '.';
		} else if (strength.length < 10) {
			out = '- Must contain atleast 10 characters.';
		}

		if (strength.id === 3) {
			out = '- Awesome! Your password is secure.';
		}

		return out;
	}

	let strength: Result<any>,
		value: number,
		color: string,
		suggestion: string;

	$: {
		strength = passwordStrength(password);
		value = strengthLevel[strength.id];
		color = colors[strength.id];
		suggestion = getSuggestion(strength);
	}
</script>

<div class="container">
	<Progress {value} {color} />
	<p>{strength.value} {suggestion}</p>
</div>

<style lang="scss">
	@use '$lib/styles/typography';
	.container {
		p {
			font-family: typography.$varela-round;
			font-weight: 300;
		}
	}
</style>
