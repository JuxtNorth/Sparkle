class Timer {
	public s = 0;
	public m = 0;
	public h = 0;
	public elapsed: number;
	public startedAt: number;
	public onUpdate: (string) => any;
	private interval: number;

	constructor(onUpdate) {
		this.onUpdate = onUpdate;
	}

	reset(): this {
		this.s = this.m = this.h = 0;
		this.startedAt = new Date().getTime();
		return this;
	}

	play(): this {
		this.interval = setInterval(() => {
			const now = new Date().getTime();
			this.elapsed = now - this.startedAt;

			this.s = Math.floor(this.elapsed / 1000);
			this.m = Math.floor(this.s / 60);
			this.h = Math.floor(this.m / 60);

			this.onUpdate(this.getString());
		}, 960);

		return this;
	}

	clear(): this {
		clearInterval(this.interval);
		return this;
	}

	getString(): string {
		const { h, m, s } = this;

		const hr = this.format(h, false);
		const mi = this.format(m);
		const se = this.format(s);

		return (
			(hr.length ? hr + ' : ' : '') + (mi.length ? mi + ' : ' : '00 : ') + (se.length ? se : '00')
		);
	}

	private format(num: number, mod = true): string {
		if (num === 0) return '';
		if (mod) num = num % 60;
		let out = num.toString();
		if (num < 10) out = '0' + out;
		return out;
	}
}

export default Timer;
