import { ItemView, type WorkspaceLeaf } from 'obsidian';

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

	constructor(leaf: WorkspaceLeaf) {
		super(leaf);
	}

	getViewType() {
		return GLOSSARY_VIEW_TYPE;
	}

	getDisplayText() {
		return GLOSSARY_PANEL_NAME;
	}

	getIcon() {
		return ICONS.glossary ?? '';
	}

	setContent(entryEl: HTMLElement) {
		if (!this.glossaryEl) return;

		if (entryExists(this.glossaryEl, entryEl)) return;

		prepareEntry(entryEl);

		this.glossaryEl.prepend(entryEl);
	}

	async onOpen() {
		this.glossaryEl = buildGlossaryPanel(this.contentEl);
	}

	async onClose() {
		// Nothing to clean up.
	}
}
