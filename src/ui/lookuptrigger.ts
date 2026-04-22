import type JADOU from "main.ts";
import { MarkdownView, Notice, View } from "obsidian";
import { SUPPORTED_VIEWS } from "utils/constants.ts";
import { lookupKeyString } from "utils/worker-handler.ts";

export function triggerLookup(plugin: JADOU) {
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
