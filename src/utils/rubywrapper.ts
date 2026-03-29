import type { Editor } from "obsidian";

export function addMDRubyWrapper(
	editor: Editor | undefined,
	keystring: string,
	originalKeystring: string,
	reading: string,
): void {
	if (!editor) {
		return;
	}
	const kanjiReadingMap = extractKanjiReadings(keystring, reading);

	const annotatedString =
		keystring === originalKeystring
			? annotateWithRuby(keystring, kanjiReadingMap)
			: annotateWithRuby(originalKeystring, kanjiReadingMap);

	editor.replaceSelection(annotatedString);

	function extractKanjiReadings(
		surface: string,
		reading: string,
	): Map<string, string> {
		const isKanji = (character: string) =>
			/\p{Script=Han}/u.test(character);

		const kanjiBlocks: string[] = [];
		let capturePattern = "";
		let followsKanji = false;

		for (const character of surface) {
			if (isKanji(character)) {
				if (!followsKanji) {
					// Add a kanji capture group
					capturePattern += "(.+)";
					// Start a new kanji block
					kanjiBlocks.push(character);

					followsKanji = true;
				} else {
					// Append the kanji to the previous block
					kanjiBlocks[kanjiBlocks.length - 1] += character;
				}
			} else {
				followsKanji = false;
				// Add the non-kanji character to the pattern
				capturePattern += character;
			}
		}

		// Get the individual readings
		const match = new RegExp(`^${capturePattern}$`).exec(reading);
		if (!match) return new Map();
		const kanjiReadings = match.slice(1);

		// Create map
		const kanjiReadingMap = new Map<string, string>();
		kanjiBlocks.forEach((kanjiBlock, index) => {
			kanjiReadingMap.set(kanjiBlock, kanjiReadings[index] ?? "");
		});

		return kanjiReadingMap;
	}

	function annotateWithRuby(
		surface: string,
		kanjiReadingMap: Map<string, string>,
	) {
		let result = surface;
		for (const [kanji, reading] of kanjiReadingMap) {
			const regex = new RegExp(kanji);
			result = result.replace(regex, `{${kanji}|${reading}}`);
		}

		return result;
	}
}
