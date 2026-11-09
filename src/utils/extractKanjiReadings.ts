import { hasKanji } from './hasKanji';

export function extractKanjiReadings(
	surface: string,
	reading: string,
): Map<string, string> {
	const kanjiBlocks: string[] = [];
	let capturePattern = '';
	let followsKanji = false;

	for (const character of surface) {
		if (hasKanji(character)) {
			if (!followsKanji) {
				// Add a kanji capture group
				capturePattern += '(.+)';
				// Start a new kanji block
				kanjiBlocks.push(character);

				followsKanji = true;
			} else {
				// Append the kanji to the previous block
				const lastIndex = kanjiBlocks.length - 1;
				const lastBlock = kanjiBlocks[lastIndex];

				if (lastBlock) {
					kanjiBlocks[lastIndex] = lastBlock + character;
				}
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
		kanjiReadingMap.set(kanjiBlock, kanjiReadings[index] ?? '');
	});

	return kanjiReadingMap;
}
