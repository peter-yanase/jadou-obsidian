import { EditorSelection } from '@codemirror/state';
import { type EditorView } from '@codemirror/view';

import type JADOU from 'main';
import { getUpcomingRuby } from './getUpcomingRuby';
import type { Jump, Ruby } from 'const/types';

export function jumpRuby(
	view: EditorView,
	plugin: JADOU,
	direction: Jump,
	select: boolean = false,
): boolean {
	const upcomingRuby: Ruby | undefined = getUpcomingRuby(view, direction);
	if (!upcomingRuby) {
		if (plugin.lastJump) plugin.lastJump = undefined;
		return false;
	}
	const rubyTextStart: number =
		upcomingRuby.start + upcomingRuby.base.length + 2;
	const target: number =
		direction === 'left'
			? plugin.lastJump === 'right'
				? rubyTextStart
				: upcomingRuby.start
			: plugin.lastJump === 'left'
				? rubyTextStart
				: upcomingRuby.end;
	view.dispatch({
		selection: select
			? EditorSelection.range(view.state.selection.main.anchor, target)
			: EditorSelection.cursor(target),
		scrollIntoView: true,
	});
	plugin.lastJump = direction;
	return true;
}
