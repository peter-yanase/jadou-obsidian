import { getDB } from './database';

export function transaction(
	storeNames: string[],
	mode: IDBTransactionMode,
): IDBTransaction | undefined {
	return getDB()?.transaction(storeNames, mode);
}
