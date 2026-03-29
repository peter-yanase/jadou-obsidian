import type JADOU from "../main.ts";
import { MarkdownView, Notice, View } from "obsidian";
import { JADOU_ICON, SUPPORTED_VIEWS } from "utils/constants.ts";
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
	const workspace = plugin.app.workspace;
	plugin.editorDuringLookup = workspace.activeEditor?.editor;

	const viewType = workspace.getActiveViewOfType(View)!.getViewType();

	if (!SUPPORTED_VIEWS.includes(viewType)) {
		new Notice("Unsupported view");
		return;
	}

	// Prioritize window selection -- PDF view and reading view
	const windowSelection = window.getSelection()?.toString();

	if (windowSelection) {
		plugin.originalKeystring = windowSelection;
		lookupKeyString(plugin);
		return;
	}

	// In Obsidian, the selection from editing view is callable even if the user is in reading view.
	// Therefore, we have to make sure we are _not_ in reading mode before we call it.
	const editingView =
		workspace.getActiveViewOfType(MarkdownView)?.getMode() === "source";
	if (editingView
		|| viewType === "lineage" // Lineage plugin support
	) {
		const editorSelection = plugin.editorDuringLookup?.getSelection();

		if (editorSelection) {
			plugin.originalKeystring = editorSelection;
			lookupKeyString(plugin);
			return;
		}
	}

	new Notice("Nothing selected");
}
