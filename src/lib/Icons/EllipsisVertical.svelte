<script>
	export let size = '1em';
	export let height = size;
	export let width = size;
	export let color = 'currentColor';
	export let viewBox = '0 0 128 512';
</script>

<svg
	xmlns="http://www.w3.org/2000/svg"
	{height}
	{width}
	{viewBox}
>
	<path
		d="M64 360a56 56 0 1 0 0 112 56 56 0 1 0 0-112zm0-160a56 56 0 1 0 0 112 56 56 0 1 0 0-112zM120 96A56 56 0 1 0 8 96a56 56 0 1 0 112 0z"
		fill={color}
	/>
</svg>
