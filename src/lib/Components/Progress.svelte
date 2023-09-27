<script lang="ts">
	export let value = 0.5;
	export let width = '100%';
	export let height = '24px';
	export let color = '#444';

	function getWidth(value: number): string {
		let width;

		let percentage = value * 100 + '%';

		if (value < 0.1) {
			width = `calc(${height} + ${percentage})`;
		} else {
			width = percentage;
		}

		return width;
	}

	let style: string;

	$: style = `
    height: ${height};
    width: ${width};
    border-radius: calc(${height} / 2);
  `;
</script>

<div class="progress-container" {style}>
	<div
		class="progress-inner"
		style="width: {getWidth(
			value
		)}; background: {color}"
	/>
</div>

<style lang="scss">
	.progress-container {
		position: relative;
		background: #cacaca;
		overflow: hidden;
		.progress-inner {
			position: absolute;
			left: 0;
			height: 100%;
			width: 80%;
			border-radius: inherit;
			transition: all 0.3s ease;
		}
	}
</style>
