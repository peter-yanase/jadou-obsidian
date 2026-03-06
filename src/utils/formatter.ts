import type { Entry, SemanticUnit } from "../types.ts";

export function extractSemanticUnits(
	entries: Entry[],
	keystring: string,
): SemanticUnit[] {
	const units: SemanticUnit[] = [];

	for (const entry of entries) {
		// Find the kanji object matching the keystring
		const matchingKanjiObject = entry.kanji.find(
			(kanjiObject) => kanjiObject.text === keystring,
		)!;

		// Discard the entry if it has the "sK" tag
		if (matchingKanjiObject.tags.includes("sK")) continue;

		for (const kanaEntry of entry.kana) {
			// Discard the kana if it has the "sk" tag
			if (kanaEntry.tags.includes("sk")) continue;

			// Discard the kana if it does not apply to the kanji
			if (
				!(
					kanaEntry.appliesToKanji.includes("*") ||
					kanaEntry.appliesToKanji.includes(matchingKanjiObject.text)
				)
			)
				continue;

			// Filter senses that apply to both the kana and the kanji
			const applicableSenses = entry.sense.filter((sense) => {
				const kanaOK =
					sense.appliesToKana.includes("*") ||
					sense.appliesToKana.includes(kanaEntry.text);
				const kanjiOK =
					sense.appliesToKanji.includes("*") ||
					sense.appliesToKanji.includes(matchingKanjiObject.text);

				return kanaOK && kanjiOK;
			});

			// Discard if no senses apply
			if (applicableSenses.length === 0) continue;

			units.push({
				kanji: matchingKanjiObject.text,
				kana: kanaEntry.text,
				kanjiTags: matchingKanjiObject.tags,
				kanaTags: kanaEntry.tags,
				kanaCommon: kanaEntry.common,
				senses: applicableSenses,
			});
		}
	}

	return units;
}
