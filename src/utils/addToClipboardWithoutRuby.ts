import { removeRuby } from './removeRuby';

export async function addToClipboardWithoutRuby(
	selection: string,
): Promise<void> {
	await navigator.clipboard.writeText(removeRuby(selection));
}
