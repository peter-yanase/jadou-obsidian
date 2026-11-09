import { DataAdapter } from 'obsidian';
import { getReadableStream } from 'utils/getReadableStream';

export class dictLoader {
	private adapter: DataAdapter;
	private dataFolderPath: string;

	constructor(adapter: DataAdapter, dataFolderPath: string) {
		this.adapter = adapter;
		this.dataFolderPath = dataFolderPath;
	}

	async loadArrayBuffer(file: string) {
		const binaryData = await this.adapter.readBinary(
			`${this.dataFolderPath}/${file}`,
		);
		const readable = getReadableStream(binaryData);
		const decompressedData = await new Response(readable).arrayBuffer();

		return decompressedData;
	}
}
