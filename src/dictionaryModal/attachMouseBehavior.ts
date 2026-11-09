import { type dictionaryModal } from 'ui/dictionaryModal';
import { updateSelection } from './updateSelection';
import { swallowEvent } from '../utils/swallowEvent';
import { addToGlossary } from './addToGlossary';
import { addFurigana } from './addFurigana';

export function attachMouseBehavior(
	resultEl: HTMLElement,
	index: number,
	modal: dictionaryModal,
) {
	// Update selection on hover
	resultEl.addEventListener('mouseenter', () => {
		updateSelection(index, modal);
	});

	resultEl.addEventListener('mousedown', (evt: MouseEvent) => {
		swallowEvent(evt);

		if (evt.button === 0) {
			window.setTimeout(() => {
				addToGlossary(modal);
			}, 0);
		} else if (evt.button === 2) {
			window.setTimeout(() => {
				addFurigana(modal);
			}, 0);
		}
	});
}
