import { lookupKanji } from './lookupKanji';

export async function lookup(message: { keystring: string }) {
	const entries = await lookupKanji(message.keystring);
	postMessage({ type: 'result', entries, keystring: message.keystring });
}
