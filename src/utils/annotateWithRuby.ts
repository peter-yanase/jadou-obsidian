export function annotateWithRuby(
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
