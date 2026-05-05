import type JADOU from "main.ts";
import type { GlossaryView } from "ui/glossarypanel.ts";
import { GLOSSARY_VIEW_TYPE } from "utils/constants.ts";

export async function getGlossaryView(plugin: JADOU): Promise<GlossaryView> {
	const { workspace } = plugin.app;

	let glossaryLeaf =
		workspace.getLeavesOfType(GLOSSARY_VIEW_TYPE)[0] ??
		(await workspace.ensureSideLeaf(GLOSSARY_VIEW_TYPE, "right", {
			active: false,
		}));

	await glossaryLeaf.setViewState({
		type: GLOSSARY_VIEW_TYPE,
	});
	return glossaryLeaf.view as GlossaryView;
}
