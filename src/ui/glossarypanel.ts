import type { WorkspaceLeaf } from "obsidian";
import { ItemView, Notice, htmlToMarkdown } from "obsidian";
import {
	GLOSSARY_VIEW_TYPE,
	JADOU_ICON,
	JADOU_GLOSSARY_PANEL_NAME,
} from "../utils/constants.ts";
import { Sorter } from "../utils/sorter.ts";

export class GlossaryView extends ItemView {
	constructor(leaf: WorkspaceLeaf) {
		super(leaf);
	}

	getViewType() {
		return GLOSSARY_VIEW_TYPE;
	}

	getDisplayText() {
		return JADOU_GLOSSARY_PANEL_NAME;
	}

	getIcon() {
		return JADOU_ICON;
	}

	async onOpen() {
		this.contentEl.empty();
		this.contentEl.addClass("glossary");

		const navigationEl = document.createElement("nav");

		const warningEl = document.createElement("span");
		warningEl.addClass("warning");
		warningEl.textContent =
			"Will be emptied on closing Obsidian or disabling the plugin.";
		navigationEl.appendChild(warningEl);

		const addButton = (label: string, handler: () => void) => {
			const buttonEl = document.createElement("button");
			buttonEl.textContent = label;
			buttonEl.addEventListener("click", handler);
			navigationEl.appendChild(buttonEl);
		};
		addButton("Copy all", () => this.copyAll());
		addButton("Clear", () => this.clear());
		addButton("Sort", () => this.sort());

		this.contentEl.appendChild(navigationEl);

		const glossaryEl = document.createElement("ul");
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

	private getGlossary(): HTMLElement | null {
		return this.contentEl.querySelector(".glossary > ul");
	}

	private entryExists(
		glossaryEl: HTMLElement,
		entryEl: HTMLElement,
	): boolean {
		const newEntryHeader = (
			entryEl.querySelector(".result-header") as HTMLElement
		).innerText;

		return Array.from(glossaryEl.children).some((child) => {
			const existingEntryHeader = (
				child.querySelector(".result-header") as HTMLElement
			)?.innerText;
			return existingEntryHeader === newEntryHeader;
		});
	}

	private prepareEntry(entryEl: HTMLElement) {
		entryEl.removeClass("is-selected");

		entryEl.addClass("entering");
		entryEl.addEventListener(
			"animationend",
			() => {
				entryEl.removeClass("entering");
			},
			{ once: true },
		);

		entryEl.addEventListener("contextmenu", () => {
			if (entryEl.hasClass("leaving")) return;
			entryEl.addClass("leaving");
			entryEl.addEventListener(
				"animationend",
				() => {
					entryEl.remove();
				},
				{ once: true },
			);
		});

		this.attachDragHandlers(entryEl);
	}

	private attachDragHandlers(entryEl: HTMLElement) {
		entryEl.setAttribute("draggable", "true");

		entryEl.addEventListener("dragstart", (event) => {
			event.dataTransfer!.dropEffect = "move"
			entryEl.addClass("dragging");

			const rawHtml = `<br>${entryEl.outerHTML}`;
			event.dataTransfer!.setData("text/html", rawHtml);

			const markdown = htmlToMarkdown(rawHtml);
			event.dataTransfer!.setData("text/plain", markdown);
		});

		entryEl.addEventListener("dragend", () => {
			entryEl.removeClass("dragging");
		});
	}

	private copyAll() {
		const glossaryEl = this.getGlossary();
		if (!glossaryEl) return;
		navigator.clipboard.writeText(htmlToMarkdown(glossaryEl.outerHTML));
		new Notice("Glossary copied");
	}

	private clear() {
		const glossaryEl = this.getGlossary();
		if (!glossaryEl) return;

		glossaryEl.addClass("leaving");
		glossaryEl.addEventListener(
			"animationend",
			() => {
				glossaryEl.empty();
				glossaryEl.removeClass("leaving");
			},
			{ once: true },
		);
	}

	private sort() {
		const glossaryEl = this.getGlossary();
		if (!glossaryEl) return;

		const entries: HTMLElement[] = Array.from(
			glossaryEl.children,
		) as HTMLElement[];

		const collator = new Intl.Collator("ja", {
			sensitivity: "base",
			caseFirst: "false",
			numeric: true,
		});

		entries
			.sort((a, b) => {
				return collator.compare(a.innerText, b.innerText);
			})
			.forEach((item) => glossaryEl.appendChild(item));
	}
}
