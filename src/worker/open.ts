import { DB_NAME, STORE_NAMES } from 'const/constants';
import { setDB } from './database';

export function open(): Promise<void> {
	return new Promise((resolve, reject) => {
		const {
			kanjiIndex: kanjiIndexName,
			entries: entriesName,
		}: Record<string, string> = STORE_NAMES;
		if (!kanjiIndexName || !entriesName) return;

		const DBOpenRequest: IDBOpenDBRequest = indexedDB.open(DB_NAME);

		// Create the object stores on upgrade
		DBOpenRequest.onupgradeneeded = () => {
			const db: IDBDatabase = DBOpenRequest.result;
			db.createObjectStore(entriesName, { keyPath: 'id' });
			db.createObjectStore(kanjiIndexName);
		};

		DBOpenRequest.onsuccess = () => {
			setDB(DBOpenRequest.result);
			resolve();
		};

		DBOpenRequest.onerror = () => {
			reject(
				new Error(DBOpenRequest.error?.message ?? 'IndexedDB error'),
			);
		};
	});
}
