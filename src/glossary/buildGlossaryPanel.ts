import { sortGlossary } from './sortGlossary';
import { copyGlossary } from './copyGlossary';
import { clearGlossary } from './clearGlossary';
import { Sorter } from 'utils/sorter';

export function buildGlossaryPanel(container: HTMLElement) {
	container.empty();
	container.addClass('glossary');

	const navigationEl = createEl('nav');

	const buttonsEl = createDiv();
	buttonsEl.addClass('buttons');
	navigationEl.appendChild(buttonsEl);

	const warningEl = createDiv();
	warningEl.addClass('warning');
	warningEl.textContent =
		'Will be emptied on closing this panel or Obsidian, or disabling the plugin.';
	navigationEl.appendChild(warningEl);

	container.appendChild(navigationEl);

	const glossaryEl = createEl('ul');
	container.appendChild(glossaryEl);

	new Sorter(glossaryEl);

	const addButton = (label: string, handler: () => void) => {
		const buttonEl = createEl('button');
		buttonEl.textContent = label;
		buttonEl.addEventListener('click', handler);
		buttonsEl.appendChild(buttonEl);
	};
	addButton('Sort', () => {
		sortGlossary(glossaryEl);
	});
	addButton('Copy all', () => {
		copyGlossary(glossaryEl);
	});
	addButton('Clear', () => {
		clearGlossary(glossaryEl);
	});

	return glossaryEl;
}
