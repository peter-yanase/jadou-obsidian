import { getTarget } from './getTarget';

export function initalizeSorter(listEl: HTMLElement) {
	let draggingEl: HTMLElement | null = null;

	listEl.addEventListener('dragstart', (event) => {
		draggingEl = getTarget(event);
	});

	listEl.addEventListener('dragend', () => {
		draggingEl = null;
	});

	listEl.addEventListener('dragover', (event) => {
		if (!draggingEl) return;
		// Allow dropping
		event.preventDefault();

		const targetEl: HTMLElement | null = getTarget(event);
		if (!targetEl || targetEl === draggingEl) return;

		const targetRectangle: DOMRect = targetEl.getBoundingClientRect();
		const isAboveCenter: boolean =
			// Check if position is higher than the center of the rectangle
			event.clientY < targetRectangle.top + targetRectangle.height / 2;

		if (isAboveCenter) {
			listEl.insertBefore(draggingEl, targetEl);
		} else {
			listEl.insertAfter(draggingEl, targetEl);
		}
	});
}
