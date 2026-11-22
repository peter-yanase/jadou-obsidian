import { htmlToMarkdown, Notice } from 'obsidian';

export function copyGlossary(glossaryEl: HTMLElement): void {
	void navigator.clipboard.writeText(htmlToMarkdown(glossaryEl.outerHTML));
	new Notice('Glossary copied');
}
