export function id(prefix = "") {
	return prefix + Math.random().toString(36).slice(2, 8);
}

export function now() {
	return Date.now();
}
