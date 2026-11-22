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

	onOpen(): void {
		// Sort the units so that those with the common tag come first
		this.units = [...this.units].sort((a, b) => {
			if (a.kanaCommon === b.kanaCommon) return 0;
			return a.kanaCommon ? -1 : 1;
		});

		this.setTitle(this.units[0]?.kanji ?? '');

		setupContainer(this);
		this.units.forEach((unit, index) => {
			const resultEl: HTMLLIElement = buildResultEl(unit, index, this);
			attachMouseBehavior(resultEl, index, this);
			this.resultsEl?.appendChild(resultEl);
		});
		this.resultsEl?.addEventListener(
			'mouseenter',
			(event) => {
				const target: EventTarget | null = event.target;
				if (!(target instanceof HTMLElement)) return;
				const closestResultEl: Element | null =
					target.closest('.result');
				if (!closestResultEl) return;

				const children: HTMLCollection | undefined =
					this.resultsEl?.children;
				if (!children) return;
				const hoveredOver: number =
					Array.from(children).indexOf(closestResultEl);
				updateSelection(hoveredOver, this);
			},
			true,
		);
		registerKeyHandlers(this);
	}

	onClose(): void {
		this.contentEl.empty();
	}
}
