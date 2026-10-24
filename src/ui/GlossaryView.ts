import { ItemView, Notice, htmlToMarkdown } from 'obsidian';
import {
	GLOSSARY_VIEW_TYPE,
	JADOU_GLOSSARY_PANEL_NAME,
	ICONS,
} from 'const/constants';
import { Sorter } from 'utils/sorter';
import { sortGlossary } from 'glossary/sortGlossary';

export class GlossaryView extends ItemView {
	getViewType() {
		return GLOSSARY_VIEW_TYPE;
	}

	getDisplayText() {
		return JADOU_GLOSSARY_PANEL_NAME;
	}

	getIcon() {
		return ICONS.glossary ?? '';
	}

	async onOpen() {
		this.contentEl.empty();
		this.contentEl.addClass('glossary');

		const navigationEl = createEl('nav');

		const buttonsEl = createDiv();
		buttonsEl.addClass('buttons');
		navigationEl.appendChild(buttonsEl);

		const addButton = (label: string, handler: () => void) => {
			const buttonEl = createEl('button');
			buttonEl.textContent = label;
			buttonEl.addEventListener('click', handler);
			buttonsEl.appendChild(buttonEl);
		};
		addButton('Sort', () => {
			sortGlossary(this);
		});
		addButton('Copy all', () => {
			this.copyAll();
		});
		addButton('Clear', () => {
			this.clear();
		});

		const warningEl = createDiv();
		warningEl.addClass('warning');
		warningEl.textContent =
			'Will be emptied on closing this panel or Obsidian, or disabling the plugin.';
		navigationEl.appendChild(warningEl);

		this.contentEl.appendChild(navigationEl);

		const glossaryEl = createEl('ul');
		this.contentEl.appendChild(glossaryEl);

		new Sorter(glossaryEl);
	}

	setContent(entryEl: HTMLElement) {
		const glossaryEl = this.getGlossary();
		if (!glossaryEl) return;

		if (this.entryExists(glossaryEl, entryEl)) return;

		this.prepareEntry(entryEl);

		glossaryEl.prepend(entryEl);
	}

	getGlossary(): HTMLElement | null {
		return this.contentEl.querySelector('.glossary > ul');
	}

	private entryExists(
		glossaryEl: HTMLElement,
		entryEl: HTMLElement,
	): boolean {
		const newEntryHeader =
			entryEl.querySelector<HTMLElement>('.result-header')?.innerText;

		return Array.from(glossaryEl.children).some((child) => {
			const existingEntryHeader =
				child.querySelector<HTMLElement>('.result-header')?.innerText;
			return existingEntryHeader === newEntryHeader;
		});
	}

	private prepareEntry(entryEl: HTMLElement) {
		entryEl.removeClass('is-selected');

		entryEl.addClass('entering');
		entryEl.addEventListener(
			'animationend',
			() => {
				entryEl.removeClass('entering');
			},
			{ once: true },
		);

		entryEl.addEventListener('contextmenu', () => {
			if (entryEl.hasClass('leaving')) return;
			entryEl.addClass('leaving');
			entryEl.addEventListener(
				'animationend',
				() => {
					entryEl.remove();
				},
				{ once: true },
			);
		});

		this.attachDragHandlers(entryEl);
	}

	private attachDragHandlers(entryEl: HTMLElement) {
		entryEl.setAttribute('draggable', 'true');

		entryEl.addEventListener('dragstart', (event) => {
			const transfer = event.dataTransfer;
			if (!transfer) return;

			transfer.dropEffect = 'move';
			entryEl.addClass('dragging');

			const rawHtml = `<br>${entryEl.outerHTML}`;
			transfer.setData('text/html', rawHtml);

			const markdown = htmlToMarkdown(rawHtml);
			transfer.setData('text/plain', markdown);
		});

		entryEl.addEventListener('dragend', () => {
			entryEl.removeClass('dragging');
		});
	}

	private copyAll() {
		const glossaryEl = this.getGlossary();
		if (!glossaryEl) return;
		void navigator.clipboard.writeText(
			htmlToMarkdown(glossaryEl.outerHTML),
		);
		new Notice('Glossary copied');
	}

	private clear() {
		const glossaryEl = this.getGlossary();
		if (!glossaryEl) return;

		glossaryEl.addClass('leaving');
		glossaryEl.addEventListener(
			'animationend',
			() => {
				glossaryEl.empty();
				glossaryEl.removeClass('leaving');
			},
			{ once: true },
		);
	}
}
