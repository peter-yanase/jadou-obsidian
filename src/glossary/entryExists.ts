export function entryExists(
	glossaryEl: HTMLElement,
	entryEl: HTMLElement,
): boolean {
	const newEntryHeader =
		entryEl.querySelector<HTMLElement>('.result-header')?.innerText;

	return Array.from(glossaryEl.children).some((child) => {
		const existingEntryHeader =
			child.querySelector<HTMLElement>('.result-header')?.innerText;
		return existingEntryHeader === newEntryHeader;
	});
}
