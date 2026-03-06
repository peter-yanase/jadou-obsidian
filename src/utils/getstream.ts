export function getReadableStream(binaryData: ArrayBuffer) {
	const decompression = new DecompressionStream("gzip");
	const readable = new Response(binaryData).body!.pipeThrough(decompression);
	return readable;
}
