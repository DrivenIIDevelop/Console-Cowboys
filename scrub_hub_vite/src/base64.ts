export function toBase64(data: ArrayBuffer) {
	// TypeScript would complain that we aren't passing in a number[]. But, this does work.
	const str = String.fromCharCode.apply(null, new Uint8Array(data) as unknown as number[]);
	return window.btoa(str); // Why this expects a string and not ArrayBuffer, I don't know.
}
export function fromBase64(data: string) {
	return Uint8Array.from(atob(data), c => c.charCodeAt(0));
}
