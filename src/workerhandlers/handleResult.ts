import { Notice } from 'obsidian';

import type JADOU from 'main';
import type {
	Entry,
	SemanticUnit,
	Tokenizer,
	WorkerMessage,
} from 'const/types';
import { tryMorphed } from './tryMorphed';
import { extractSemanticUnits } from 'utils/extractSemanticUnits';
import { dictionaryModal } from 'ui/dictionaryModal';

export function handleResult(
	message: Extract<WorkerMessage, { type: 'result' }>,
	tokenizer: Tokenizer,
	worker: Worker,
	plugin: JADOU,
): void {
	const entries: Entry[] = message.entries;
	const keystring: string = message.keystring;
	if (entries.length === 0) {
		new Notice(`No matches for ${keystring}`);

		tryMorphed(keystring, tokenizer, worker);
		return;
	}

	const units: SemanticUnit[] = extractSemanticUnits(entries, keystring);

	if (units.length === 0) {
		new Notice('Nothing found');
		return;
	}
	new dictionaryModal(plugin, units, keystring).open();
}
