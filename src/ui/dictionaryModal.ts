import { Modal } from 'obsidian';

import type JADOU from 'main';
import type { SemanticUnit } from 'const/types';
import { setupContainer } from 'dictionaryModal/setupContainer';
import { buildResultEl } from 'dictionaryModal/buildResultEl';
import { attachMouseBehavior } from 'dictionaryModal/attachMouseBehavior';
import { registerKeyHandlers } from 'dictionaryModal/registerKeyHandlers';
import { updateSelection } from 'dictionaryModal/updateSelection';

export class dictionaryModal extends Modal {
	plugin: JADOU;
	units: SemanticUnit[];
	keystring: string;

	constructor(plugin: JADOU, units: SemanticUnit[], keystring: string) {
		super(plugin.app);

		this.plugin = plugin;
		this.units = units;
		this.keystring = keystring;
	}

	selectedIndex = 0;
	resultsEl?: HTMLElement;

	onOpen() {
		// Sort the units so that those with the common tag come first
		this.units = [...this.units].sort((a, b) => {
			if (a.kanaCommon === b.kanaCommon) return 0;
			return a.kanaCommon ? -1 : 1;
		});

		this.setTitle(this.units[0]?.kanji ?? '');

		setupContainer(this);
		this.units.forEach((unit, index) => {
			const resultEl = buildResultEl(unit, index, this);
			attachMouseBehavior(resultEl, index, this);
			this.resultsEl?.appendChild(resultEl);
		});
		this.resultsEl?.addEventListener(
			'mouseenter',
			(event) => {
				const closestResultEl = (event.target as HTMLElement).closest(
					'.result',
				);
				if (!closestResultEl) return;

				const children = this.resultsEl?.children;
				if (!children) return;
				const hoveredOver =
					Array.from(children).indexOf(closestResultEl);
				updateSelection(hoveredOver, this);
			},
			true,
		);
		registerKeyHandlers(this);
	}

	onClose() {
		this.contentEl.empty();
	}
}
