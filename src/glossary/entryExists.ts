export function entryExists(
	glossaryEl: HTMLElement,
	entryEl: HTMLElement,
): boolean {
	const newEntryHeader: string | undefined =
		entryEl.querySelector<HTMLElement>('.result-header')?.innerText;

	return Array.from(glossaryEl.children).some((child) => {
		const existingEntryHeader: string | undefined =
			child.querySelector<HTMLElement>('.result-header')?.innerText;
		return existingEntryHeader === newEntryHeader;
	});
}
