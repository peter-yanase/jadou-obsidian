import { TokenizerBuilder } from '@patdx/kuromoji';
import { Notice, requestUrl } from 'obsidian';

import type JADOU from 'main';
import { DATA_FILES } from 'const/constants';
import { dictLoader } from 'utils/dictLoader';
import { registerWorkerMessageHandler } from 'workerhandlers/registerMessageHandler';

export async function initializePlugin(plugin: JADOU) {
	const worker = plugin.worker;
	if (!worker) return;

	const { adapter } = plugin.app.vault;
	const dataFolderPath = plugin.dataFolderPath;
	if (!dataFolderPath) return;

	if (!(await adapter.exists(dataFolderPath)))
		await adapter.mkdir(dataFolderPath);

	for (const dataFile of DATA_FILES) {
		const fileName = dataFile.name;
		const dataPath = `${dataFolderPath}/${fileName}`;

		if (await adapter.exists(dataPath)) continue;

		try {
			new Notice(`Downloading ${fileName}…`);
			const response = await requestUrl(dataFile.url);
			await adapter.writeBinary(dataPath, response.arrayBuffer);
			new Notice(`Downloaded ${fileName}`);
		} catch {
			new Notice(`Failed to download ${dataFile.name}`);
			return;
		}
	}

	const tokenizer = await new TokenizerBuilder({
		loader: new dictLoader(adapter, dataFolderPath),
	}).build();

	registerWorkerMessageHandler(
		plugin,
		adapter,
		dataFolderPath,
		worker,
		tokenizer,
	);

	worker.postMessage({ type: 'init' });
}
