import { type dictionaryModal } from 'ui/dictionaryModal';
import { addMDRubyWrapper } from 'utils/addMDRubyWrapper';

export function addFurigana(modal: dictionaryModal) {
	addMDRubyWrapper(
		modal.plugin,
		modal.keystring,
		modal.units[modal.selectedIndex]?.kana ?? '',
	);
	modal.close();
}
