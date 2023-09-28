const styling = `
  position: absolute;
  border-radius: 50%;
`;

const keyframes = [
	{ transform: 'scale(1)', opacity: '1' },
	{ transform: 'scale(12)', opacity: '0' }
];

const timing = {
	duration: 600
};

interface RippleOptions {
	duration?: number;
	color?: string;
}

export function ripple(node: HTMLElement, options: RippleOptions = {}): void {
	const rect = node.getBoundingClientRect();

	const handleClick = (e: MouseEvent): void => {
		const span = document.createElement('span');
		span.style.cssText = styling;
		node.appendChild(span);

		const d = Math.min(node.clientWidth, node.clientHeight);
		const r = d / 2;

		Object.assign(span.style, {
			width: `${d}px`,
			height: `${d}px`,
			left: `${e.clientX - (rect.left + r)}px`,
			top: `${e.clientY - (rect.top + r)}px`,
			backgroundColor: options.color || '#ffffff88'
		});

		node.appendChild(span);

		span.animate(keyframes, {
			duration: options.duration || 600
		});

		setTimeout(() => span.remove(), options.duration || 600);
	};

	node.addEventListener('click', handleClick);
}
