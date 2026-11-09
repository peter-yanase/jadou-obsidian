import type JADOU from 'main';
import { extractKanjiReadings } from './extractKanjiReadings';
import { annotateWithRuby } from './annotateWithRuby';

export function addMDRubyWrapper(
	plugin: JADOU,
	keystring: string,
	reading: string,
): void {
	const editor = plugin.editorDuringLookUp;

	const originalKeystring = plugin.originalKeystring;
	if (!originalKeystring) return;

	const kanjiReadingMap = extractKanjiReadings(keystring, reading);

	const annotatedString =
		keystring === originalKeystring
			? annotateWithRuby(keystring, kanjiReadingMap)
			: annotateWithRuby(originalKeystring, kanjiReadingMap);

	editor?.replaceSelection(annotatedString);
}
