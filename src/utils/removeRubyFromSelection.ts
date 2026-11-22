import type { Editor } from 'obsidian';

import { removeRuby } from './removeRuby';

export function removeRubyFromSelection(
	editor: Editor,
	selection: string,
): void {
	editor.replaceSelection(removeRuby(selection));
}
