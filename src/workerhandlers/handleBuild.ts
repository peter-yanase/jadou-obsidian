import { type DataAdapter, Notice } from 'obsidian';

import { JMDICT_FILE } from 'const/constants';

export async function handleBuild(
	adapter: DataAdapter,
	dataFolderPath: string,
	worker: Worker,
) {
	const binaryData = await adapter.readBinary(
		`${dataFolderPath}/${JMDICT_FILE}`,
	);
	worker.postMessage({ type: 'build', binaryData });
	new Notice('Building database');
}
