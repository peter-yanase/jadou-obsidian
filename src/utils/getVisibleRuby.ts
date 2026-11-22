import { type EditorView } from '@codemirror/view';

import type { Ruby } from 'const/types';
import { extractRuby } from './extractRuby';

export function getVisibleRuby(view: EditorView): Ruby[] {
	const visibleRuby: Ruby[] = [];
	for (const { from, to } of view.visibleRanges) {
		const documentSlice: string = view.state.sliceDoc(from, to);
		const offset: number = from;
		visibleRuby.push(...extractRuby(documentSlice, offset));
	}
	return visibleRuby;
}
