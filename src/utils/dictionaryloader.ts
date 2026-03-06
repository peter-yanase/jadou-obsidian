import type JADOU from "main.ts";
import { getReadableStream } from "utils/getstream.ts";

export class dictLoader {
	plugin: JADOU;

	constructor(plugin: JADOU) {
		this.plugin = plugin;
	}

	async loadArrayBuffer(file: string) {
		const adapter = this.plugin.app.vault.adapter;
		const binaryData = await adapter.readBinary(
			`${this.plugin.dataFolderPath}/${file}`,
		);
		const readable = getReadableStream(binaryData);
		const decompressedData = await new Response(readable).arrayBuffer();

		return decompressedData;
	}
}
