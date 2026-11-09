export function get<T>(
	ObjectStore: IDBObjectStore,
	key: IDBValidKey,
): Promise<T | undefined> {
	return new Promise((resolve) => {
		const DBRequest = ObjectStore.get(key);

		DBRequest.onsuccess = () => {
			resolve(DBRequest.result as T | undefined);
		};

		DBRequest.onerror = () => {
			resolve(undefined);
		};
	});
}
