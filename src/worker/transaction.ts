import { getDB } from './database';

export function transaction(storeNames: string[], mode: IDBTransactionMode) {
	return getDB()?.transaction(storeNames, mode);
}
