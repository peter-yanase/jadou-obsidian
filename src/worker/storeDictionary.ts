import type { DictionaryObject, Entry } from 'const/types';
import { database } from './database';
import { STORE_NAMES } from 'const/constants';

export async function storeDictionary(
	dictionary: DictionaryObject,
): Promise<void> {
	const entries: Entry[] = dictionary.words;

	// Build kanji index for fast lookup
	const kanjiIndex: Map<string, number[]> = new Map<string, number[]>();
	for (const entry of entries) {
		for (const kanji of entry.kanji) {
			const key: string = kanji.text;
			if (!kanjiIndex.has(key)) kanjiIndex.set(key, []);
			kanjiIndex.get(key)?.push(entry.id);
		}
	}

	const {
		kanjiIndex: kanjiIndexName,
		entries: entriesName,
	}: Record<string, string> = STORE_NAMES;
	if (!kanjiIndexName || !entriesName) return;

	const transaction: IDBTransaction | undefined = database.transaction(
		[entriesName, kanjiIndexName],
		'readwrite',
	);
	if (!transaction) return;

	const entriesStore: IDBObjectStore = transaction.objectStore(entriesName);
	for (const entry of entries) entriesStore.put(entry);

	const kanjiStore: IDBObjectStore = transaction.objectStore(kanjiIndexName);
	for (const [key, ids] of kanjiIndex) kanjiStore.put(ids, key);

	await new Promise<void>((resolve, reject) => {
		transaction.oncomplete = () => {
			resolve();
		};

		transaction.onerror = () => {
			reject(
				new Error(transaction.error?.message ?? 'Transaction error'),
			);
		};

		transaction.onabort = () => {
			reject(
				new Error(transaction.error?.message ?? 'Transaction aborted'),
			);
		};
	});
}
