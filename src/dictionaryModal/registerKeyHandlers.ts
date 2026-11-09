import { type dictionaryModal } from 'ui/dictionaryModal';
import { updateSelection } from './updateSelection';
import { addFurigana } from './addFurigana';
import { addToGlossary } from './addToGlossary';
import { swallowEvent } from '../utils/swallowEvent';

export function registerKeyHandlers(modal: dictionaryModal) {
	const actions: Record<string, () => void> = {
		ArrowDown: () => {
			updateSelection(modal.selectedIndex + 1, modal);
		},
		ArrowUp: () => {
			updateSelection(modal.selectedIndex - 1, modal);
		},
		Enter: () => {
			addToGlossary(modal);
		},
		Space: () => {
			addFurigana(modal);
		},
		Escape: () => {
			modal.close();
		},
	};

	modal.containerEl.addEventListener('keydown', (event) => {
		swallowEvent(event);
		const action = actions[event.code];
		if (action) {
			action();
		}
	});
}
