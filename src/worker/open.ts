import { DB_NAME, STORE_NAMES } from 'const/constants';
import { setDB } from './database';


export function open(): Promise<void> {
	return new Promise((resolve, reject) => {
		const DBOpenRequest = indexedDB.open(DB_NAME);

		// Create the object stores on upgrade
		DBOpenRequest.onupgradeneeded = () => {
			const db = DBOpenRequest.result;
			db.createObjectStore(STORE_NAMES.entries, { keyPath: 'id' });
			db.createObjectStore(STORE_NAMES.kanjiIndex);
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
