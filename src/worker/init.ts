import { STORE_NAMES } from 'const/constants';
import { Database } from './database';

export async function init() {
	await Database.open();

	// Check if there are any entries
	const transaction = Database.transaction([STORE_NAMES.entries], 'readonly');
	if (!transaction) return;
	const entriesStore = transaction.objectStore(STORE_NAMES.entries);
	const count = await new Promise<number>((resolve) => {
		const DBRequest = entriesStore.count();
		DBRequest.onsuccess = () => {
			resolve(DBRequest.result);
		};
		DBRequest.onerror = () => {
			resolve(0);
		};
	});

	postMessage({ type: count > 0 ? 'ready' : 'build' });
}
