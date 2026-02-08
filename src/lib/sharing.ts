export function encodeStrategy(name: string, code: string): string {
	const data = JSON.stringify({ name, code });
	const encoded = btoa(unescape(encodeURIComponent(data)));
	const url = new URL(window.location.href);
	url.searchParams.set('strategy', encoded);
	return url.toString();
}

export function decodeStrategy(url: string): { name: string; code: string } | null {
	try {
		const parsed = new URL(url);
		const encoded = parsed.searchParams.get('strategy');
		if (!encoded) return null;
		const data = JSON.parse(decodeURIComponent(escape(atob(encoded))));
		if (typeof data.name === 'string' && typeof data.code === 'string') {
			return { name: data.name, code: data.code };
		}
		return null;
	} catch {
		return null;
	}
}
