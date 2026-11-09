export function clearGlossary(glossaryEl: HTMLElement) {
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
