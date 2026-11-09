import { attachDragHandlers } from './attachDragHandlers';

export function prepareEntry(entryEl: HTMLElement) {
	entryEl.removeClass('is-selected');

	// Briefly add CSS class for animation
	entryEl.addClass('entering');
	entryEl.addEventListener(
		'animationend',
		() => {
			entryEl.removeClass('entering');
		},
		{ once: true },
	);

	// Add CSS class for animation then remove entry
	entryEl.addEventListener('contextmenu', () => {
		// Disable right click during animation
		if (entryEl.hasClass('leaving')) return;

		entryEl.addClass('leaving');
		entryEl.addEventListener(
			'animationend',
			() => {
				entryEl.remove();
			},
			{ once: true },
		);
	});

	attachDragHandlers(entryEl);
}
