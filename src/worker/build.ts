import type { DictionaryObject } from 'const/types';
import { getReadableStream } from 'utils/getReadableStream';
import { storeDictionary } from './storeDictionary';

export async function build(message: { binaryData: ArrayBuffer }) {
	const readable = getReadableStream(message.binaryData);
	const text = await new Response(readable).text();
	const dictionary = JSON.parse(text) as DictionaryObject;

	await storeDictionary(dictionary);
	postMessage({ type: 'ready' });
}
