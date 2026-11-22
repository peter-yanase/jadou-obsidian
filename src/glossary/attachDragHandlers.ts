import { htmlToMarkdown } from 'obsidian';

export function attachDragHandlers(entryEl: HTMLElement): void {
	entryEl.setAttribute('draggable', 'true');

	entryEl.addEventListener('dragstart', (event) => {
		const transfer: DataTransfer | null = event.dataTransfer;
		if (!transfer) return;

		transfer.dropEffect = 'move';
		entryEl.addClass('dragging');

		const rawHtml: string = `<br>${entryEl.outerHTML}`;
		transfer.setData('text/html', rawHtml);

		const markdown: string = htmlToMarkdown(rawHtml);
		transfer.setData('text/plain', markdown);
	});

	entryEl.addEventListener('dragend', () => {
		entryEl.removeClass('dragging');
	});
}
