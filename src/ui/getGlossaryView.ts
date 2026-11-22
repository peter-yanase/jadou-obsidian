import { type View, type Workspace } from 'obsidian';

import { GlossaryView } from 'ui/GlossaryView';
import { GLOSSARY_VIEW_TYPE } from 'const/constants';

export async function getGlossaryView(
	workspace: Workspace,
): Promise<GlossaryView> {
	const view: View = (
		await workspace.ensureSideLeaf(GLOSSARY_VIEW_TYPE, 'right', {
			active: true,
			reveal: false,
		})
	).view;

	if (!(view instanceof GlossaryView)) {
		throw new Error(
			`Expected ${GLOSSARY_VIEW_TYPE}, got ${view.getViewType()}`,
		);
	}

	return view;
}
