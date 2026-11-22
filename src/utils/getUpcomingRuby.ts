import { type EditorView } from '@codemirror/view';

import { rubyRenderingExtension } from 'rendering/rubyRenderingExtension';
import type { Jump, Ruby } from 'const/types';
import { isInsideCode } from './isInsideCode';
import { isSourceMode } from './isSourceMode';
import { type rubyRenderingViewPlugin } from 'rendering/rubyRenderingViewPlugin';

export function getUpcomingRuby(
	view: EditorView,
	contact: Jump,
): Ruby | undefined {
	if (isSourceMode(view)) return;
	const cursorPosition: number = view.state.selection.main.head;
	if (isInsideCode(cursorPosition, view)) return;
	const viewPlugin: rubyRenderingViewPlugin | null = view.plugin(
		rubyRenderingExtension,
	);
	if (!viewPlugin) return;
	const upcomingRuby: Ruby | undefined = viewPlugin.cachedRuby.find((ruby) =>
		contact === 'right'
			? cursorPosition === ruby.start
			: cursorPosition === ruby.end,
	);
	return upcomingRuby;
}
