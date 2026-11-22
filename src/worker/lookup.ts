import type { Entry } from 'const/types';
import { lookupKanji } from './lookupKanji';

export async function lookup(message: { keystring: string }): Promise<void> {
	const entries: Entry[] | undefined = await lookupKanji(message.keystring);
	postMessage({ type: 'result', entries, keystring: message.keystring });
}
