import { type DataAdapter, Notice } from 'obsidian';

import { JMDICT_FILE } from 'const/constants';

export async function handleBuild(
	adapter: DataAdapter,
	dataFolderPath: string,
	worker: Worker,
): Promise<void> {
	const binaryData: ArrayBuffer = await adapter.readBinary(
		`${dataFolderPath}/${JMDICT_FILE}`,
	);
	worker.postMessage({ type: 'build', binaryData });
	new Notice('Building database');
}
