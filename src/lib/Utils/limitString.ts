function limitString(str: string, maxLength: number, postfix = ''): string {
	let out;
	if (str.length > maxLength) {
		out = str.slice(0, maxLength) + postfix;
	} else {
		out = str;
	}

	return out;
}

export default limitString;
