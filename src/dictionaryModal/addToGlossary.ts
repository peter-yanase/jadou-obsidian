import { getGlossaryView } from 'ui/getGlossaryView';
import { type dictionaryModal } from 'ui/dictionaryModal';
import { type GlossaryView } from 'ui/GlossaryView';

export function addToGlossary(modal: dictionaryModal): void {
	const formattedResultEl: Element | undefined =
		modal.resultsEl?.children[modal.selectedIndex];
	if (!formattedResultEl?.instanceOf(HTMLElement)) return;

	modal.close();

	window.setTimeout(() => {
		void (async () => {
			const resultView: GlossaryView = await getGlossaryView(
				modal.plugin.app.workspace,
			);
			const clonedResultEl: Node = formattedResultEl.cloneNode(true);
			if (!clonedResultEl.instanceOf(HTMLElement)) return;

			const header: Element | null =
				clonedResultEl.querySelector('.result-header');
			header?.append(`【${modal.keystring}】`);

			resultView.setContent(clonedResultEl);
		})();
	}, 0);
}
