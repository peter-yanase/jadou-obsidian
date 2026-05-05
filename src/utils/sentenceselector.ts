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
        const nextIdx = line.indexOf(separator, cursorPosition);
        if (nextIdx !== -1) {
            sentenceEnd = Math.min(sentenceEnd, nextIdx + separator.length);
        }

        // Previous separator before cursor
        const prevIdx = line.lastIndexOf(separator, cursorPosition - 1);
        if (prevIdx !== -1) {
            sentenceStart = Math.max(sentenceStart, prevIdx + separator.length);
        }
    }

    editor.setSelection(
        { line: cursor.line, ch: sentenceStart },
        { line: cursor.line, ch: sentenceEnd }
    );
}
