import type JADOU from "main.ts";
import type { SemanticUnit } from "../types.ts";
import { Modal } from "obsidian";
import { ABBREVIATIONS } from "../utils/constants.ts";
import { addMDRubyWrapper } from "../utils/rubywrapper.ts";

export class JADOUListModal extends Modal {
	private plugin: JADOU;
	private units: SemanticUnit[];
	private keystring: string;

	constructor(plugin: JADOU, units: SemanticUnit[], keystring: string) {
		super(plugin.app);

		this.plugin = plugin;
		this.units = units;
		this.keystring = keystring;
	}

	private selectedIndex = 0;
	private resultsEl: HTMLElement | null = null;

	onOpen() {
		// Sort the units so that those with the common tag come first
		this.units = [...this.units].sort((a, b) => {
			if (a.kanaCommon === b.kanaCommon) return 0;
			return a.kanaCommon ? -1 : 1;
		});

		this.setupContainer();
		this.units.forEach((unit, index) => {
			const resultEl = this.buildResultEl(unit, index);
			this.attachMouseBehavior(resultEl, index);
			this.resultsEl!.appendChild(resultEl);
		});
		this.resultsEl!.addEventListener(
			"mouseenter",
			(event) => {
				const closestResultEl = (event.target as HTMLElement).closest(
					".result",
				);
				if (!closestResultEl) return;

				const hoveredOver = Array.from(
					this.resultsEl!.children,
				).indexOf(closestResultEl);
				this.updateSelection(hoveredOver);
			},
			true,
		);
		this.registerKeyHandlers();
	}

	onClose() {
		this.contentEl.empty();
	}

	private setupContainer() {
		const { modalEl, containerEl } = this;

		modalEl.addClass("jadou-modal");

		// Shift focus to the container
		containerEl.setAttribute("tabindex", "0");
		containerEl.focus();

		const resultsEl = createEl("ul");
		resultsEl.addClass("results");
		this.resultsEl = resultsEl;
		this.contentEl.appendChild(resultsEl);
	}

	private swallow(event: KeyboardEvent | MouseEvent) {
		event.preventDefault();
		event.stopPropagation();
	}

	private buildResultEl(unit: SemanticUnit, index: number) {
		const resultEl = createEl("li");
		resultEl.addClass("result");

		const resultHeaderEl = createEl("strong");
		resultHeaderEl.addClass("result-header");
		resultHeaderEl.appendText(unit.kana);
		if (unit.kanaCommon) {
			resultHeaderEl.setAttribute("data-kanaflag", "common");
		}
		if (unit.kanaTags.length > 0) {
			unit.kanaTags.forEach((element: string) => {
				// Filter out "gikun"
				if (element !== "gikun") {
					// Add remaining 1 tag
					resultHeaderEl.setAttribute("data-kanaflag", element);
				}
			});
		}
		resultHeaderEl.appendText(`【${unit.kanji}】`);
		resultEl.appendChild(resultHeaderEl);

		const resultMainEl = createEl("ol");
		resultMainEl.addClass("result-main");
		resultEl.appendChild(resultMainEl);
		for (const sense of unit.senses) {
			const senseEl = createEl("li");

			senseEl.appendText(
				sense.gloss.map((gloss) => gloss.text).join("; "),
			);

			const tags = [
				...sense.dialect.map((dialect) => ABBREVIATIONS[dialect]!),
				...sense.misc.map((misc) => ABBREVIATIONS[misc]!),
			].join("; ");

			if (tags) {
				const tagsEl = createEl("span");
				tagsEl.appendText(" (");

				const taglistEl = createEl("strong");
				taglistEl.addClass("tags");
				taglistEl.appendText(tags);
				tagsEl.appendChild(taglistEl);

				tagsEl.appendText(")");

				senseEl.appendChild(tagsEl);
			}

			resultMainEl.appendChild(senseEl);
		}

		// Update the selected result
		if (index === this.selectedIndex) {
			resultEl.addClass("is-selected");
		}

		return resultEl;
	}

	private attachMouseBehavior(resultEl: HTMLElement, index: number) {
		// Update selection on hover
		resultEl.addEventListener("mouseenter", () => {
			this.updateSelection(index);
		});

		resultEl.addEventListener("mousedown", (evt: MouseEvent) => {
			this.swallow(evt);

			if (evt.button === 0) {
				setTimeout(() => this.addToGlossary(), 0);
			} else if (evt.button === 2) {
				setTimeout(() => this.addFurigana(), 0);
			}
		});
	}

	private updateSelection(newIndex: number) {
		// Clamp index to valid range
		newIndex = Math.max(0, Math.min(newIndex, this.units.length - 1));

		const children = this.resultsEl!.children;

		// Deselect previous
		children[this.selectedIndex]!.removeClass("is-selected");

		// Select new
		children[newIndex]!.addClass("is-selected");
		children[newIndex]!.scrollIntoView({ block: "nearest" });
		this.selectedIndex = newIndex;
	}

	private addFurigana() {
		addMDRubyWrapper(
			this.plugin.editorDuringLookup,
			this.keystring,
			this.plugin.originalKeystring!,
			this.units[this.selectedIndex]!.kana,
		);
		this.close();
	}

	private addToGlossary() {
		const formattedResultEl = this.resultsEl!.children[
			this.selectedIndex
		] as HTMLElement;
		this.close();
		setTimeout(() => {
			void (async () => {
				const resultView = await this.plugin.getGlossaryView();
				const clonedResultEl = formattedResultEl.cloneNode(
					true,
				) as HTMLElement;
				resultView.setContent(clonedResultEl);
			})();
		}, 0);
	}

	private registerKeyHandlers() {
		const actions: Record<string, () => void> = {
			ArrowDown: () => this.updateSelection(this.selectedIndex + 1),
			ArrowUp: () => this.updateSelection(this.selectedIndex - 1),
			Enter: () => this.addToGlossary(),
			Space: () => this.addFurigana(),
			Escape: () => this.close(),
		};

		this.containerEl.addEventListener("keydown", (event) => {
			this.swallow(event);
			const action = actions[event.code];
			if (action) {
				action();
			}
		});
	}
}
