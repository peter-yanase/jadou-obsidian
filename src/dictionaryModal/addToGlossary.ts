import { getGlossaryView } from 'ui/getGlossaryView';
import { type dictionaryModal } from 'ui/dictionaryModal';

export function addToGlossary(modal: dictionaryModal) {
	const formattedResultEl = modal.resultsEl?.children[modal.selectedIndex];
	if (!formattedResultEl?.instanceOf(HTMLElement)) return;

	modal.close();

	window.setTimeout(() => {
		void (async () => {
			const resultView = await getGlossaryView(
				modal.plugin.app.workspace,
			);
			const clonedResultEl = formattedResultEl.cloneNode(true);
			if (!clonedResultEl.instanceOf(HTMLElement)) return;

			const header = clonedResultEl.querySelector('.result-header');
			header?.append(`【${modal.keystring}】`);

			resultView.setContent(clonedResultEl);
		})();
	}, 0);
}
