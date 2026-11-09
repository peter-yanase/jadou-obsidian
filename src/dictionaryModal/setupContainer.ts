import { type dictionaryModal } from 'ui/dictionaryModal';

export function setupContainer(modal: dictionaryModal) {
	const { modalEl, containerEl } = modal;

	modalEl.addClass('jadou-modal');

	// Shift focus to the container
	containerEl.setAttribute('tabindex', '0');
	containerEl.focus();

	const resultsEl = createEl('ul');
	resultsEl.addClass('results');
	modal.resultsEl = resultsEl;
	modal.contentEl.appendChild(resultsEl);
}
