import type JADOU from 'main';
import { ICONS } from 'utils/constants';
import { selectSentence } from 'utils/sentenceselector';

export const selectSentenceCmds = [cmdSelectSentence, clickSelectSentence];

const selectSentenceName = 'Select sentence';
const selectSentenceIcon = ICONS['selectSentence'] ?? '';

function cmdSelectSentence(plugin: JADOU) {
	plugin.addCommand({
		id: 'select-sentence',
		name: selectSentenceName,
		icon: selectSentenceIcon,
		editorCallback: (editor) => selectSentence(editor),
	});
}

function clickSelectSentence(plugin: JADOU) {
	plugin.registerEvent(
		plugin.app.workspace.on('editor-menu', (menu, editor) => {
			menu.addItem((item) => {
				item.setTitle(selectSentenceName)
					.setIcon(selectSentenceIcon)
					.onClick(() => selectSentence(editor));
			});
		}),
	);
}
