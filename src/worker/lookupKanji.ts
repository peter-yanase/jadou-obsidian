import { STORE_NAMES } from 'const/constants';
import { database } from './database';
import type { Entry } from 'const/types';

export async function lookupKanji(
	keystring: string,
): Promise<Entry[] | undefined> {
	const {
		kanjiIndex: kanjiIndexName,
		entries: entriesName,
	}: Record<string, string> = STORE_NAMES;
	if (!kanjiIndexName || !entriesName) return;

	const transaction: IDBTransaction | undefined = database.transaction(
		[kanjiIndexName, entriesName],
		'readonly',
	);
	if (!transaction) return;

	const kanjiIndexStore: IDBObjectStore =
		transaction.objectStore(kanjiIndexName);
	const entriesStore: IDBObjectStore = transaction.objectStore(entriesName);

	const ids: number[] =
		(await database.get(kanjiIndexStore, keystring)) ?? [];

	const results: Entry[] = [];
	for (const id of ids) {
		const entry: Entry | undefined = await database.get<Entry>(
			entriesStore,
			id,
		);
		if (entry) results.push(entry);
	}

	return results;
}
