import { ItemView } from 'obsidian';

import {
	GLOSSARY_VIEW_TYPE,
	GLOSSARY_PANEL_NAME,
	ICONS,
} from 'const/constants';
import { buildGlossaryPanel } from 'glossary/buildGlossaryPanel';
import { entryExists } from 'glossary/entryExists';
import { prepareEntry } from 'glossary/prepareEntry';

export class GlossaryView extends ItemView {
	glossaryEl?: HTMLElement;

	getViewType(): string {
		return GLOSSARY_VIEW_TYPE;
	}

	getDisplayText(): string {
		return GLOSSARY_PANEL_NAME;
	}

	getIcon(): string {
		return ICONS.glossary ?? '';
	}

	setContent(entryEl: HTMLElement): void {
		if (!this.glossaryEl) return;

		if (entryExists(this.glossaryEl, entryEl)) return;

		prepareEntry(entryEl);

		this.glossaryEl.prepend(entryEl);
	}

	async onOpen(): Promise<void> {
		this.glossaryEl = buildGlossaryPanel(this.contentEl);
	}

	async onClose(): Promise<void> {
		// Nothing to clean up.
	}
}
