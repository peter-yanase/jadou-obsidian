import { type EditorView } from '@codemirror/view';

import type { Ruby } from 'const/types';

export function isCursorInsideRuby(ruby: Ruby, view: EditorView): boolean {
	const cursorPosition: number = view.state.selection.main.head;
	return cursorPosition > ruby.start && cursorPosition < ruby.end;
}
