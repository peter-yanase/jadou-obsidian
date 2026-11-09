import type { DictionaryObject } from 'const/types';
import { Database } from './database';
import { STORE_NAMES } from 'const/constants';

export async function storeDictionary(dictionary: DictionaryObject) {
	const entries = dictionary.words;

	// Build kanji index for fast lookup
	const kanjiIndex = new Map<string, number[]>();
	for (const entry of entries) {
		for (const kanji of entry.kanji) {
			const key = kanji.text;
			if (!kanjiIndex.has(key)) kanjiIndex.set(key, []);
			kanjiIndex.get(key)?.push(entry.id);
		}
	}

	const transaction = Database.transaction(
		[STORE_NAMES.entries, STORE_NAMES.kanjiIndex],
		'readwrite',
	);

	if (!transaction) return;

	const entriesStore = transaction.objectStore(STORE_NAMES.entries);
	for (const entry of entries) entriesStore.put(entry);

	const kanjiStore = transaction.objectStore(STORE_NAMES.kanjiIndex);
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
