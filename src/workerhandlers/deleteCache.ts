import { Notice } from 'obsidian';

import JADOU from 'main';
import { DB_NAME } from 'const/constants';
import { terminateWorker } from 'utils/worker-handler';

export async function deleteCache(plugin: JADOU) {
	const dbs = await indexedDB.databases();
	const dbExists = dbs.some((db) => db.name === DB_NAME);

	if (!dbExists) {
		new Notice('No dictionary cache');
		return;
	}

	terminateWorker(plugin);

	const request = indexedDB.deleteDatabase(DB_NAME);
	request.onsuccess = () => new Notice('Dictionary cache deleted');
	plugin.dictionaryReady = false;
}
