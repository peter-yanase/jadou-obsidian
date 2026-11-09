import { open } from './open';
import { transaction } from './transaction';
import { get } from './get';

let db: IDBDatabase | null = null;

export function setDB(database: IDBDatabase) {
	db = database;
}

export function getDB() {
	return db;
}

export const Database = { open, transaction, get };
