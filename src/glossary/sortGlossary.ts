export function sortGlossary(glossaryEl: HTMLElement): void {
	const entries: HTMLElement[] = Array.from(glossaryEl.children).filter(
		(child) => child.instanceOf(HTMLElement),
	);

	const collator: Intl.Collator = new Intl.Collator('ja', {
		sensitivity: 'base',
		caseFirst: 'false',
		numeric: true,
	});

	entries
		.sort((a, b) => {
			return collator.compare(a.innerText, b.innerText);
		})
		.forEach((item) => glossaryEl.appendChild(item));
}
