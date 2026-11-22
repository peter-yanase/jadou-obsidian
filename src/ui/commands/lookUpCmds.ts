import type JADOU from 'main';
import { triggerLookUp } from 'ui/triggerLookUp';
import { ICONS, NAMES } from 'const/constants';
import { lookUpKeystring } from 'workerhandlers/lookUpKeystring';

export const lookUpCmds = [cmdLookUp, clickLookUp, ribbonLookup];

function cmdLookUp(plugin: JADOU): void {
	plugin.addCommand({
		id: 'lookup',
		name: NAMES.lookUp ?? '',
		icon: ICONS.lookUp,
		callback: () => {
			triggerLookUp(plugin);
		},
	});
}

// This does not work inside PDFs because the PDF viewer has a separate context menu
function clickLookUp(plugin: JADOU): void {
	plugin.registerEvent(
		plugin.app.workspace.on('editor-menu', (menu, editor) => {
			const selection = editor.getSelection();
			if (!selection) return;
			plugin.originalKeystring = selection;
			plugin.editorDuringLookUp = editor;
			menu.addItem((item) => {
				item.setTitle(NAMES.lookUp ?? '')
					.setIcon(ICONS.lookUp ?? '')
					.onClick(() => {
						lookUpKeystring(plugin);
					});
			});
		}),
	);
}

function ribbonLookup(plugin: JADOU): void {
	plugin.addRibbonIcon(ICONS.lookUp ?? '', NAMES.lookUp ?? '', () => {
		triggerLookUp(plugin);
	});
}
