import type { Editor } from "obsidian";
import { SENTENCE_SEPARATORS } from "utils/constants.ts";

export function selectSentence(editor: Editor) {
	const cursor = editor.getCursor();
	const line = editor.getLine(cursor.line);
	const cursorPosition = cursor.ch;

	let sentenceStart = 0;
	let sentenceEnd = line.length;

	for (const separator of SENTENCE_SEPARATORS) {
		// Next separator after cursor
		const separatorAfter = line.indexOf(separator, cursorPosition);
		if (separatorAfter !== -1) {
			sentenceEnd = Math.min(
				sentenceEnd,
				separatorAfter + separator.length,
			);
		}

		// Last separator before cursor
		const separatorBefore = line.lastIndexOf(separator, cursorPosition - 1);
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
