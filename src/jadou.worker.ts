import type { Entry, DictionaryObject, WorkerMessage } from "./types.ts";
import { DB_NAME, STORE_NAMES } from "./utils/constants.ts";
import { getReadableStream } from "utils/getstream.ts";

const Database = (() => {
	let db: IDBDatabase | null = null;

	function open(): Promise<void> {
		return new Promise((resolve, reject) => {
			const DBOpenRequest = indexedDB.open(DB_NAME);

			// Create the object stores on upgrade
			DBOpenRequest.onupgradeneeded = () => {
				const db = DBOpenRequest.result;
				db.createObjectStore(STORE_NAMES.entries, { keyPath: "id" });
				db.createObjectStore(STORE_NAMES.kanjiIndex);
			};

			DBOpenRequest.onsuccess = () => {
				db = DBOpenRequest.result;
				resolve();
			};
			DBOpenRequest.onerror = () => reject(DBOpenRequest.error);
		});
	}

	function transaction(storeNames: string[], mode: IDBTransactionMode) {
		return db!.transaction(storeNames, mode);
	}

	function get(ObjectStore: IDBObjectStore, key: IDBValidKey): Promise<any> {
		return new Promise((resolve) => {
			const DBRequest = ObjectStore.get(key);
			DBRequest.onsuccess = () => resolve(DBRequest.result);
			DBRequest.onerror = () => resolve(undefined);
		});
	}

	return { open, transaction, get };
})();

const Dictionary = (() => {
	async function storeDictionary(dictionary: DictionaryObject) {
		const entries = dictionary.words;

		// Build kanji index for fast lookup
		const kanjiIndex = new Map<string, number[]>();
		for (const entry of entries) {
			for (const kanji of entry.kanji) {
				const key = kanji.text;
				if (!kanjiIndex.has(key)) kanjiIndex.set(key, []);
				kanjiIndex.get(key)!.push(entry.id);
			}
		}

		const transaction = Database.transaction(
			[STORE_NAMES.entries, STORE_NAMES.kanjiIndex],
			"readwrite",
		);
		const entriesStore = transaction.objectStore(STORE_NAMES.entries);
		for (const entry of entries) entriesStore.put(entry);

		const kanjiStore = transaction.objectStore(STORE_NAMES.kanjiIndex);
		for (const [key, ids] of kanjiIndex) kanjiStore.put(ids, key);

		await new Promise<void>((resolve, reject) => {
			transaction.oncomplete = () => resolve();
			transaction.onerror = () => reject(transaction.error);
			transaction.onabort = () => reject(transaction.error);
		});
	}

	async function lookupKanji(keystring: string) {
		const transaction = Database.transaction(
			[STORE_NAMES.kanjiIndex, STORE_NAMES.entries],
			"readonly",
		);
		const kanjiIndexStore = transaction.objectStore(STORE_NAMES.kanjiIndex);
		const entriesStore = transaction.objectStore(STORE_NAMES.entries);

		const ids: number[] =
			(await Database.get(kanjiIndexStore, keystring)) ?? [];

		const results: Entry[] = [];
		for (const id of ids) {
			const entry = await new Promise<Entry | null>((resolve) => {
				const DBRequest = entriesStore.get(id);
				DBRequest.onsuccess = () => resolve(DBRequest.result ?? null);
				DBRequest.onerror = () => resolve(null);
			});
			if (entry) results.push(entry);
		}

		return results;
	}

	return { storeDictionary, lookupKanji };
})();

const Handlers = {
	async init() {
		await Database.open();

		// Check if there are any entries
		const transaction = Database.transaction(
			[STORE_NAMES.entries],
			"readonly",
		);
		const entriesStore = transaction.objectStore(STORE_NAMES.entries);
		const count = await new Promise<number>((resolve) => {
			const DBRequest = entriesStore.count();
			DBRequest.onsuccess = () => resolve(DBRequest.result);
			DBRequest.onerror = () => resolve(0);
		});

		postMessage({ type: count > 0 ? "ready" : "build" });
	},

	async build(message: { binaryData: ArrayBuffer }) {
		const readable = getReadableStream(message.binaryData);
		const text = await new Response(readable).text();
		const dictionary: DictionaryObject = JSON.parse(text);

		await Dictionary.storeDictionary(dictionary);
		postMessage({ type: "ready" });
	},

	async lookup(message: { keystring: string }) {
		const entries = await Dictionary.lookupKanji(message.keystring);
		postMessage({ type: "result", entries, keystring: message.keystring });
	},
};

const Router: Record<WorkerMessage["type"], (message: any) => void> = {
	init: () => Handlers.init(),
	build: (message) => Handlers.build(message),
	lookup: (message) => Handlers.lookup(message),
};

onmessage = (event) => {
	const message: WorkerMessage = event.data;
	Router[message.type](message);
};
