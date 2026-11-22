export function clearGlossary(glossaryEl: HTMLElement): void {
	glossaryEl.addClass('leaving');
	glossaryEl.addEventListener(
		'animationend',
		() => {
			glossaryEl.empty();
			glossaryEl.removeClass('leaving');
		},
		{ once: true },
	);
}
