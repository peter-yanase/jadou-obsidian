import { STORE_NAMES } from 'const/constants';
import { database } from './database';

export async function init(): Promise<void> {
	await database.open();

	// Check if there are any entries
	const { entries: entriesName }: Record<string, string> = STORE_NAMES;
	if (!entriesName) return;

	const transaction: IDBTransaction | undefined = database.transaction(
		[entriesName],
		'readonly',
	);
	if (!transaction) return;

	const entriesStore: IDBObjectStore = transaction.objectStore(entriesName);
	const count: number = await new Promise<number>((resolve) => {
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
