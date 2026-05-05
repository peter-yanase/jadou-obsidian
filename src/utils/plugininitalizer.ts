import type JADOU from "main.ts";
import { TokenizerBuilder } from "@patdx/kuromoji";
import { DATA_FILES } from "utils/constants.ts";
import { dictLoader } from "utils/dictionaryloader.ts";
import { isDownloaded } from "utils/downloader.ts";
import { setupWorker } from "utils/worker-handler.ts";

export async function initializePlugin(plugin: JADOU) {
	const { adapter } = plugin.app.vault;

	if (!(await adapter.exists(plugin.dataFolderPath)))
		await adapter.mkdir(plugin.dataFolderPath);

	for (const dataFile of DATA_FILES) {
		if (!(await isDownloaded(plugin, adapter, dataFile))) return;
	}

	const tokenizer = await new TokenizerBuilder({
		loader: new dictLoader(plugin),
	}).build();

	setupWorker(plugin, tokenizer);
}
