import type JADOU from "../main.ts";
import { MarkdownView, Notice, View } from "obsidian";
import { JADOU_ICON } from "utils/constants.ts";
import { lookupKeyString } from "../utils/worker-handler.ts";

// Wrapper function
export function addCommands(plugin: JADOU) {
	clickLookUp(plugin);
	cmdLookUp(plugin);
	ribbonLookup(plugin);
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

function triggerLookup(plugin: JADOU) {
	const wspace = plugin.app.workspace;
	plugin.editorDuringLookup = wspace.activeEditor?.editor;

	const viewType = wspace.getActiveViewOfType(View)?.getViewType();

	if (viewType !== "markdown" && viewType !== "pdf") {
		new Notice("Unsupported view");
		return;
	}

	// Prioritize window
	const windowSelection = window.getSelection()?.toString();

	if (windowSelection) {
		plugin.originalKeystring = windowSelection;
		lookupKeyString(plugin);
		return;
	}

	// Make sure the selection from editing view does not bleed through the reading view
	const editingView =
		wspace.getActiveViewOfType(MarkdownView)?.getMode() === "source";
	if (editingView) {
		const editorSelection = plugin.editorDuringLookup?.getSelection();

		if (editorSelection) {
			plugin.originalKeystring = editorSelection;
			lookupKeyString(plugin);
			return;
		}
	}

	new Notice("Nothing selected");
}
