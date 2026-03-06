import type JADOU from "main.ts";
import { Notice, requestUrl, DataAdapter } from "obsidian";
import { DataFile } from "types.ts";

export async function isDownloaded(
	plugin: JADOU,
	adapter: DataAdapter,
	dataFile: DataFile,
) {
	const fileName = dataFile.name;
	const dataPath = `${plugin.dataFolderPath}/${fileName}`;

	if (await adapter.exists(dataPath)) {
		return true;
	}

	new Notice(`Downloading ${fileName}…`);

	try {
		const response = await requestUrl(dataFile.url);
		await adapter.writeBinary(dataPath, response.arrayBuffer);
		new Notice(`Downloaded ${fileName}`);
		return true;
	} catch (err) {
		new Notice(`Failed to download ${fileName}`);
		return false;
	}
}
