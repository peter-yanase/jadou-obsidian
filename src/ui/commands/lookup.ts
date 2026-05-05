import type JADOU from "main.ts";
import { triggerLookUp } from "ui/lookuptrigger.ts";
import { ICONS } from "utils/constants.ts";
import { lookUpKeystring } from "utils/worker-handler.ts";

export const lookUpCmds = [cmdLookUp, clickLookUp, ribbonLookup];

const lookUpName = "Look up expression";
const lookUpIcon = ICONS["lookUp"] ?? "";

function cmdLookUp(plugin: JADOU) {
	plugin.addCommand({
		id: "lookup",
		name: lookUpName,
		icon: lookUpIcon,
		callback: () => {
			triggerLookUp(plugin);
		},
	});
}

// This does not work inside PDFs because the PDF viewer has a separate context menu
function clickLookUp(plugin: JADOU) {
	plugin.registerEvent(
		plugin.app.workspace.on("editor-menu", (menu, editor) => {
			const selection = editor.getSelection();
			if (!selection) return;
			plugin.originalKeystring = selection;
			plugin.editorDuringLookUp = editor;
			menu.addItem((item) => {
				item.setTitle(lookUpName)
					.setIcon(lookUpIcon)
					.onClick(() => lookUpKeystring(plugin));
			});
		}),
	);
}

function ribbonLookup(plugin: JADOU) {
	plugin.addRibbonIcon(lookUpIcon, lookUpName, () => {
		triggerLookUp(plugin);
	});
}
