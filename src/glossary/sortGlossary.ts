import { GlossaryView } from 'ui/GlossaryView';

export function sortGlossary(view: GlossaryView) {
	const glossaryEl = view.getGlossary();
	if (!glossaryEl) return;

	const entries: HTMLElement[] = Array.from(
		glossaryEl.children,
	) as HTMLElement[];

	const collator = new Intl.Collator('ja', {
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
