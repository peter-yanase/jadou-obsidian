import { sortGlossary } from './sortGlossary';
import { copyGlossary } from './copyGlossary';
import { clearGlossary } from './clearGlossary';
import { initalizeSorter } from 'utils/sorter';

export function buildGlossaryPanel(container: HTMLElement): HTMLUListElement {
	container.empty();
	container.addClass('glossary');

	const navigationEl: HTMLElement = createEl('nav');

	const buttonsEl: HTMLDivElement = createDiv();
	buttonsEl.addClass('buttons');
	navigationEl.appendChild(buttonsEl);

	const warningEl: HTMLDivElement = createDiv();
	warningEl.addClass('warning');
	warningEl.textContent =
		'Will be emptied on closing this panel or Obsidian, or disabling the plugin.';
	navigationEl.appendChild(warningEl);

	container.appendChild(navigationEl);

	const glossaryEl: HTMLUListElement = createEl('ul');
	container.appendChild(glossaryEl);

	initalizeSorter(glossaryEl);

	const addButton = (label: string, handler: () => void) => {
		const buttonEl: HTMLButtonElement = createEl('button');
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
