import { MD_RUBY_SYNTAX } from 'const/constants';

export function annotateWithRuby(
	surface: string,
	kanjiReadingMap: Map<string, string>,
): string {
	let result: string = surface;
	for (const [kanji, reading] of kanjiReadingMap) {
		const regex: RegExp = new RegExp(kanji);
		result = result.replace(
			regex,
			`${MD_RUBY_SYNTAX.head}${kanji}${MD_RUBY_SYNTAX.divider}${reading}${MD_RUBY_SYNTAX.tail}`,
		);
	}

	return result;
}
