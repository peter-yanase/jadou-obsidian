import { MarkdownView, Notice, View } from 'obsidian';

import type JADOU from 'main';
import { SUPPORTED_VIEWS } from 'const/constants';
import { lookUpKeystring } from 'utils/worker-handler';

export function triggerLookUp(plugin: JADOU) {
	const { workspace } = plugin.app;
	const viewType = workspace.getActiveViewOfType(View)?.getViewType();
	if (!viewType) return;

	if (!SUPPORTED_VIEWS.includes(viewType))
		return new Notice('Unsupported view');

	plugin.editorDuringLookUp = workspace.activeEditor?.editor;

	// Prioritize window selection -- PDF view, embedded PDF, and reading view
	// This needs to run every time to catch the selection inside embedded PDFs.
	const windowSelection = window.getSelection()?.toString();
	if (windowSelection) {
		runLookUp(windowSelection);
		return;
	}

	// First we make sure we are not in reading mode.
	// (In Obsidian, the selection from editing view is callable even if the user is in reading view.)
	if (workspace.getActiveViewOfType(MarkdownView)?.getMode() === 'preview') {
		showNoSelectionMsg();
		return;
	}

	// Next we make sure we are not focused on an embedded PDF
	// (If something is selected in the editor and then the embeded PDF is focused on without selection,
	// Obsidian will still call the selection from the editor.)
	const { activeElement } = activeDocument;
	if (
		activeElement?.hasClass('pdf-embed') ||
		activeElement?.hasClass('textLayer')
	) {
		showNoSelectionMsg();
		return;
	}

	const editorSelection = plugin.editorDuringLookUp?.getSelection();
	if (editorSelection) {
		runLookUp(editorSelection);
		return;
	}

	showNoSelectionMsg();

	function runLookUp(keystring: string) {
		plugin.originalKeystring = keystring;
		lookUpKeystring(plugin);
	}

	function showNoSelectionMsg() {
		new Notice('Nothing selected');
	}
}
