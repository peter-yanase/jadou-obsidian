export function getReadableStream(
	binaryData: ArrayBuffer,
): ReadableStream | undefined {
	const decompression: DecompressionStream = new DecompressionStream('gzip');
	const readable: ReadableStream | undefined = new Response(
		binaryData,
	).body?.pipeThrough(decompression);
	return readable;
}
