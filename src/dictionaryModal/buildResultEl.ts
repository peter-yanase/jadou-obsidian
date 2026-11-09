import { ABBREVIATIONS } from 'const/constants';
import type { SemanticUnit } from 'const/types';
import { type dictionaryModal } from 'ui/dictionaryModal';

export function buildResultEl(
	unit: SemanticUnit,
	index: number,
	modal: dictionaryModal,
) {
	const resultEl = createEl('li');
	resultEl.addClass('result');

	const resultHeaderEl = createEl('strong');
	resultHeaderEl.addClass('result-header');
	resultHeaderEl.appendText(unit.kana);
	if (unit.kanaCommon) {
		resultHeaderEl.setAttribute('data-kanaflag', 'common');
	}
	if (unit.kanaTags.length > 0) {
		unit.kanaTags.forEach((element: string) => {
			// Filter out "gikun"
			if (element !== 'gikun') {
				// Add remaining 1 tag
				resultHeaderEl.setAttribute('data-kanaflag', element);
			}
		});
	}
	resultEl.appendChild(resultHeaderEl);

	const resultMainEl = createEl('ol');
	resultMainEl.addClass('result-main');
	resultEl.appendChild(resultMainEl);

	for (const sense of unit.senses) {
		const senseEl = createEl('li');

		senseEl.appendText(sense.gloss.map((gloss) => gloss.text).join('; '));

		const tags = [
			...sense.dialect.map((dialect) => ABBREVIATIONS[dialect]),
			...sense.misc.map((misc) => ABBREVIATIONS[misc]),
		].join('; ');

		if (tags) {
			const tagsEl = createSpan();
			tagsEl.appendText(' (');

			const taglistEl = createEl('strong');
			taglistEl.addClass('tags');
			taglistEl.appendText(tags);
			tagsEl.appendChild(taglistEl);

			tagsEl.appendText(')');

			senseEl.appendChild(tagsEl);
		}

		resultMainEl.appendChild(senseEl);
	}

	// Update the selected result
	if (index === modal.selectedIndex) {
		resultEl.addClass('is-selected');
	}

	return resultEl;
}
