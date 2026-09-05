import type JADOU from 'main';
import { getReadableStream } from 'utils/getstream';

export class dictLoader {
	plugin: JADOU;

	constructor(plugin: JADOU) {
		this.plugin = plugin;
	}

	async loadArrayBuffer(file: string) {
		const { adapter } = this.plugin.app.vault;
		const binaryData = await adapter.readBinary(
			`${this.plugin.dataFolderPath}/${file}`,
		);
		const readable = getReadableStream(binaryData);
		const decompressedData = await new Response(readable).arrayBuffer();

		return decompressedData;
	}
}
