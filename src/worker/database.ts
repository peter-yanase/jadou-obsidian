import { open } from './open';
import { transaction } from './transaction';
import { get } from './get';

let db: IDBDatabase | null = null;

export function setDB(database: IDBDatabase): void {
	db = database;
}

export function getDB(): IDBDatabase | null {
	return db;
}

export const database = { open, transaction, get };
