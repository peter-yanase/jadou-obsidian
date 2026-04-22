import type JADOU from "../main.ts";
import { JADOU_ICON } from "utils/constants.ts";
import { lookupKeyString } from "../utils/worker-handler.ts";
import { selectSentence } from "utils/sentenceselector.ts";
import { triggerLookup } from "./lookuptrigger.ts";


// Wrapper function
export function addCommands(plugin: JADOU) {
	clickLookUp(plugin);
	cmdLookUp(plugin);
	ribbonLookup(plugin);
	cmdSelectSentence(plugin);
	clickSelectSentence(plugin);
}

function clickLookUp(plugin: JADOU) {
	plugin.registerEvent(
		plugin.app.workspace.on("editor-menu", (menu, editor) => {
			const selection = editor.getSelection();
			if (!selection) return;
			plugin.originalKeystring = selection;
			plugin.editorDuringLookup = editor;
			menu.addItem((item) => {
				item.setTitle("Look up")
					.setIcon(JADOU_ICON)
					.onClick(() => lookupKeyString(plugin));
			});
		}),
	);
}

function cmdLookUp(plugin: JADOU) {
	plugin.addCommand({
		id: "lookup",
		name: "Look up expression",
		icon: JADOU_ICON,
		callback: () => {
			triggerLookup(plugin);
		},
	});
}

function ribbonLookup(plugin: JADOU) {
	plugin.addRibbonIcon(JADOU_ICON, "Look up expression", () => {
		triggerLookup(plugin);
	});
}

function cmdSelectSentence(plugin: JADOU) {
	plugin.addCommand({
		id: "select-sentence",
		name: "Select sentence",
		icon: "wand",
		editorCallback: (editor) => selectSentence(editor)
	});
}

function clickSelectSentence(plugin: JADOU) {
	plugin.registerEvent(
		plugin.app.workspace.on("editor-menu", (menu, editor) => {
			menu.addItem((item) => {
				item
					.setTitle("Select sentence")
					.setIcon("wand")
					.onClick(() => selectSentence(editor));
			});
		})
	);
}
