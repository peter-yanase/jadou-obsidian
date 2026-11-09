import { STORE_NAMES } from 'const/constants';
import { Database } from './database';
import type { Entry } from 'const/types';

export async function lookupKanji(keystring: string) {
	const transaction = Database.transaction(
		[STORE_NAMES.kanjiIndex, STORE_NAMES.entries],
		'readonly',
	);
	if (!transaction) return;
	const kanjiIndexStore = transaction.objectStore(STORE_NAMES.kanjiIndex);
	const entriesStore = transaction.objectStore(STORE_NAMES.entries);

	const ids: number[] =
		(await Database.get(kanjiIndexStore, keystring)) ?? [];

	const results: Entry[] = [];
	for (const id of ids) {
		const entry = await Database.get<Entry>(entriesStore, id);
		if (entry) results.push(entry);
	}

	return results;
}
