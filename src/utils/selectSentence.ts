import { type EditorPosition, type Editor } from 'obsidian';

import { SENTENCE_SEPARATORS } from 'const/constants';

export function selectSentence(editor: Editor): void {
	const cursor: EditorPosition = editor.getCursor();
	const line: string = editor.getLine(cursor.line);
	const cursorPosition: number = cursor.ch;

	let sentenceStart: number = 0;
	let sentenceEnd: number = line.length;

	for (const separator of SENTENCE_SEPARATORS) {
		// Next separator after cursor
		const separatorAfter: number = line.indexOf(separator, cursorPosition);
		if (separatorAfter !== -1) {
			sentenceEnd = Math.min(
				sentenceEnd,
				separatorAfter + separator.length,
			);
		}

		// Last separator before cursor
		const separatorBefore: number = line.lastIndexOf(
			separator,
			cursorPosition - 1,
		);
		if (separatorBefore !== -1) {
			sentenceStart = Math.max(
				sentenceStart,
				separatorBefore + separator.length,
			);
		}
	}

	editor.setSelection(
		{ line: cursor.line, ch: sentenceStart },
		{ line: cursor.line, ch: sentenceEnd },
	);
}
