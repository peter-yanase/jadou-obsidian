import { type Editor } from 'obsidian';

import type JADOU from 'main';
import { extractKanjiReadings } from './extractKanjiReadings';
import { annotateWithRuby } from './annotateWithRuby';

export function addMDRuby(
	plugin: JADOU,
	keystring: string,
	reading: string,
): void {
	const editor: Editor | undefined = plugin.editorDuringLookUp;

	const originalKeystring: string | undefined = plugin.originalKeystring;
	if (!originalKeystring) return;

	const kanjiReadingMap: Map<string, string> = extractKanjiReadings(
		keystring,
		reading,
	);

	const annotatedString: string =
		keystring === originalKeystring
			? annotateWithRuby(keystring, kanjiReadingMap)
			: annotateWithRuby(originalKeystring, kanjiReadingMap);

	editor?.replaceSelection(annotatedString);
}
