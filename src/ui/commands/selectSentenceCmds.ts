import type JADOU from 'main';
import { ICONS, NAMES } from 'const/constants';
import { selectSentence } from 'utils/selectSentence';

export const selectSentenceCmds = [cmdSelectSentence, clickSelectSentence];

function cmdSelectSentence(plugin: JADOU): void {
	plugin.addCommand({
		id: 'select-sentence',
		name: NAMES.selectSentence ?? '',
		icon: ICONS.selectSentence ?? '',
		editorCallback: (editor) => {
			selectSentence(editor);
		},
	});
}

function clickSelectSentence(plugin: JADOU): void {
	plugin.registerEvent(
		plugin.app.workspace.on('editor-menu', (menu, editor) => {
			menu.addItem((item) => {
				item.setTitle(NAMES.selectSentence ?? '')
					.setIcon(ICONS.selectSentence ?? '')
					.onClick(() => {
						selectSentence(editor);
					});
			});
		}),
	);
}
