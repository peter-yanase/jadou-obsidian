import type JADOU from "main.ts";
import type { Tokenizer, WorkerMessage } from "types.ts";
import { Notice } from "obsidian";
import { JADOUListModal } from "ui/readingsuggester.ts";
import { DB_NAME, JMDICT_FILE } from "utils/constants.ts";
import { extractSemanticUnits } from "utils/formatter.ts";

export function setupWorker(plugin: JADOU, tokenizer: Tokenizer) {
	const worker = plugin.worker!;

	async function handleBuild() {
		const { adapter } = plugin.app.vault;

		const binaryData = await adapter.readBinary(
			`${plugin.dataFolderPath}/${JMDICT_FILE}`,
		);
		worker.postMessage({ type: "build", binaryData });
		new Notice("Building database");
	}

	function handleReady() {
		new Notice("Dictionary ready to use");
		plugin.dictionaryReady = true;
	}

	function handleResult(message: Extract<WorkerMessage, { type: "result" }>) {
		const entries = message.entries;
		const keystring = message.keystring;
		if (entries.length === 0) {
			new Notice(`No matches for ${keystring}`);
			tryMorphed(keystring);
			return;
		}

		const units = extractSemanticUnits(entries, keystring);

		if (units.length === 0) {
			new Notice("Nothing found");
			return;
		}
		new JADOUListModal(plugin, units, keystring).open();
	}

	function tryMorphed(keystring: string) {
		const newKeystring = tokenizer.tokenize(keystring)[0]?.basic_form;
		let validNewKeyString = false;
		if (
			newKeystring &&
			newKeystring !== "*" &&
			newKeystring !== keystring
		) {
			validNewKeyString = true;
		}
		if (validNewKeyString) {
			new Notice(`Searching for ${newKeystring}`);
			plugin.worker!.postMessage({
				type: "lookup",
				keystring: newKeystring,
			});
		}
	}

	function handleWorkerMessage(event: MessageEvent<WorkerMessage>) {
		const msg = event.data;

		switch (msg.type) {
			case "build":
				void handleBuild();
				break;
			case "ready":
				handleReady();
				break;
			case "result":
				handleResult(msg);
				break;
		}
	}

	worker.onmessage = handleWorkerMessage;

	worker.postMessage({ type: "init" });
}

export function lookUpKeystring(plugin: JADOU) {
	const worker = plugin.worker;
	if (!worker) {
		new Notice("Reload the plugin!");
		return;
	}

	if (!plugin.dictionaryReady) {
		new Notice("Database not ready");
		return;
	}

	worker.postMessage({
		type: "lookup",
		keystring: plugin.originalKeystring,
	});
}

export function terminateWorker(plugin: JADOU) {
	const worker = plugin.worker;
	if (!worker) return;
	worker.terminate();
	plugin.worker = null;
}

export async function deleteCache(plugin: JADOU) {
	const dbs = await indexedDB.databases();
	const dbExists = dbs.some((db) => db.name === DB_NAME);

	if (!dbExists) {
		new Notice("No dictionary cache");
		return;
	}

	terminateWorker(plugin);

	const request = indexedDB.deleteDatabase(DB_NAME);
	request.onsuccess = () => new Notice("Dictionary cache deleted");
	plugin.dictionaryReady = false;
}
