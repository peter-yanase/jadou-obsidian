import { Notice } from 'obsidian';

import type JADOU from 'main';
import { DB_NAME } from 'const/constants';
import { terminateWorker } from './terminateWorker';

export async function deleteCache(plugin: JADOU): Promise<void> {
	const dbs: IDBDatabaseInfo[] = await indexedDB.databases();
	const dbExists: boolean = dbs.some((db) => db.name === DB_NAME);

	if (!dbExists) {
		new Notice('No dictionary cache');
		return;
	}

	terminateWorker(plugin);

	const request: IDBRequest = indexedDB.deleteDatabase(DB_NAME);
	request.onsuccess = () => new Notice('Dictionary cache deleted');
	plugin.dictionaryReady = false;
}
