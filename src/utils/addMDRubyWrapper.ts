import { MD_RUBY_SYNTAX } from 'const/constants';
import { EditorPosition, type Editor } from 'obsidian';

// Wrap selected text in MD ruby markup
export function addMDRubyWrapper(editor: Editor, selection: string): void {
	editor.replaceSelection(
		`${MD_RUBY_SYNTAX.head}${selection}${MD_RUBY_SYNTAX.divider}${MD_RUBY_SYNTAX.tail}`,
	);

	// Step inside the bracket for user input
	const cursor: EditorPosition = editor.getCursor();
	editor.setCursor({ line: cursor.line, ch: cursor.ch - 1 });
}
