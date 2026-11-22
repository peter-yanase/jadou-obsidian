import { DataAdapter } from 'obsidian';

import { getReadableStream } from 'utils/getReadableStream';

export function dictLoader(adapter: DataAdapter, dataFolderPath: string) {
	async function loadArrayBuffer(file: string): Promise<ArrayBuffer> {
		const binaryData: ArrayBuffer = await adapter.readBinary(
			`${dataFolderPath}/${file}`,
		);
		const readable: ReadableStream | undefined =
			getReadableStream(binaryData);

		const decompressedData: ArrayBuffer = await new Response(
			readable,
		).arrayBuffer();

		return decompressedData;
	}
	return { loadArrayBuffer };
}
