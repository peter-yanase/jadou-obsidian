import { htmlToMarkdown } from 'obsidian';

export function attachDragHandlers(entryEl: HTMLElement) {
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
