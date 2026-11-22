import { type Editor, type Plugin } from 'obsidian';

import { ICONS, NAMES } from 'const/constants';
import { convertAndReplace } from 'utils/convertAndReplace';

export const convertToHTMLCmds = [cmdConvertToHTML];

function cmdConvertToHTML(plugin: Plugin): void {
	plugin.addCommand({
		id: 'convert-to-html',
		name: NAMES.convertToHTML ?? '',
		icon: ICONS.convertToHTML,
		editorCheckCallback: (checking: boolean, editor: Editor) => {
			if (!checking) convertAndReplace(editor, 'HTML');
			return true;
		},
	});
}
