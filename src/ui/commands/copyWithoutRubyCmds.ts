import { type Editor, type Menu, type Plugin } from 'obsidian';

import { ICONS, NAMES } from 'const/constants';
import { addToClipboardWithoutRuby } from 'utils/addToClipboardWithoutRuby';

export const copyWithoutRubyCmds = [cmdCopyWithoutRuby, clickCopyWithoutRuby];

async function cmdCopyWithoutRuby(plugin: Plugin): Promise<void> {
	plugin.addCommand({
		id: 'copy-without-ruby',
		name: NAMES.copyWithoutRuby ?? '',
		icon: ICONS.copyWithoutRuby,
		editorCheckCallback: (checking: boolean, editor: Editor) => {
			if (!checking) {
				const selection: string = editor.getSelection();
				if (!selection) return false;
				void addToClipboardWithoutRuby(selection);
			}
			return true;
		},
	});
}

async function clickCopyWithoutRuby(plugin: Plugin): Promise<void> {
	plugin.registerEvent(
		plugin.app.workspace.on(
			'editor-menu',
			(menu: Menu, editor: Editor, _) => {
				const selection: string = editor.getSelection();
				if (!selection) return;
				menu.addItem((item) => {
					item.setTitle(NAMES.copyWithoutRuby ?? '')
						.setIcon(ICONS.copyWithoutRuby ?? '')
						.onClick(() => {
							void addToClipboardWithoutRuby(selection);
						});
				});
			},
		),
	);
}
