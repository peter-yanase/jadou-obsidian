import { type dictionaryModal } from 'ui/dictionaryModal';

export function updateSelection(newIndex: number, modal: dictionaryModal) {
	// Clamp index to valid range
	newIndex = Math.max(0, Math.min(newIndex, modal.units.length - 1));

	const children = modal.resultsEl?.children;
	if (!children) return;

	// Deselect previous
	children[modal.selectedIndex]?.removeClass('is-selected');

	// Select new
	children[newIndex]?.addClass('is-selected');
	children[newIndex]?.scrollIntoView({ block: 'nearest' });
	modal.selectedIndex = newIndex;
}
