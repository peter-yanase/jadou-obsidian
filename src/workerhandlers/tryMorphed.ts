import { Notice } from 'obsidian';

import type { Tokenizer } from 'const/types';

export function tryMorphed(
	keystring: string,
	tokenizer: Tokenizer,
	worker: Worker,
) {
	const newKeystring = tokenizer.tokenize(keystring)[0]?.basic_form;
	let validNewKeyString = false;
	if (newKeystring && newKeystring !== '*' && newKeystring !== keystring) {
		validNewKeyString = true;
	}
	if (validNewKeyString) {
		new Notice(`Searching for ${newKeystring ?? ''}`);
		worker.postMessage({
			type: 'lookup',
			keystring: newKeystring,
		});
	}
}
