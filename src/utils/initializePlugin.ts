import { TokenizerBuilder } from '@patdx/kuromoji';
import { Notice, requestUrl, RequestUrlResponse, type Vault } from 'obsidian';

import type JADOU from 'main';
import { DATA_FILES } from 'const/constants';
import { registerWorkerMessageHandler } from 'workerhandlers/registerMessageHandler';
import type { Tokenizer } from 'const/types';
import { dictLoader } from './dictLoader';

export async function initializePlugin(plugin: JADOU): Promise<void> {
	const worker: Worker | null = plugin.worker;
	if (!worker) return;

	const { adapter }: Vault = plugin.app.vault;
	const dataFolderPath: string | undefined = plugin.dataFolderPath;
	if (!dataFolderPath) return;

	if (!(await adapter.exists(dataFolderPath)))
		await adapter.mkdir(dataFolderPath);

	for (const dataFile of DATA_FILES) {
		const fileName: string | undefined = dataFile.name;
		const url: string | undefined = dataFile.url;
		if (!fileName || !url) continue;

		const dataPath: string = `${dataFolderPath}/${fileName}`;

		if (await adapter.exists(dataPath)) continue;

		try {
			new Notice(`Downloading ${fileName}…`);
			const response: RequestUrlResponse = await requestUrl(url);
			await adapter.writeBinary(dataPath, response.arrayBuffer);
			new Notice(`Downloaded ${fileName}`);
		} catch {
			new Notice(`Failed to download ${fileName}`);
			return;
		}
	}

	const tokenizer: Tokenizer = await new TokenizerBuilder({
		loader: dictLoader(adapter, dataFolderPath),
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
