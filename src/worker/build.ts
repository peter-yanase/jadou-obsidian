import type { DictionaryObject } from 'const/types';
import { getReadableStream } from 'utils/getReadableStream';
import { storeDictionary } from './storeDictionary';

export async function build(message: {
	binaryData: ArrayBuffer;
}): Promise<void> {
	const readable: ReadableStream | undefined = getReadableStream(
		message.binaryData,
	);
	const text: string = await new Response(readable).text();
	const dictionary: DictionaryObject = JSON.parse(text) as DictionaryObject;

	await storeDictionary(dictionary);
	postMessage({ type: 'ready' });
}
