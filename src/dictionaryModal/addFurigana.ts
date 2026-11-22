import { type dictionaryModal } from 'ui/dictionaryModal';
import { addMDRuby } from 'utils/addMDRuby';

export function addFurigana(modal: dictionaryModal): void {
	addMDRuby(
		modal.plugin,
		modal.keystring,
		modal.units[modal.selectedIndex]?.kana ?? '',
	);
	modal.close();
}
