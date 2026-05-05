import type { Editor } from "obsidian";
import { Plugin } from "obsidian";
import JADOUWorker from "jadou.worker";
import { addCommands } from "ui/commands.ts";
import { GlossaryView } from "ui/glossarypanel.ts";
import { JADOUSettingsTab } from "ui/settingstab.ts";
import { DATA_FOLDER, GLOSSARY_VIEW_TYPE } from "utils/constants.ts";
import { initializePlugin } from "utils/plugininitalizer.ts";
import { terminateWorker } from "utils/worker-handler.ts";

export default class JADOU extends Plugin {
	worker: Worker | null = new JADOUWorker();
	dictionaryReady: boolean = false;
	editorDuringLookUp: Editor | undefined = undefined;
	originalKeystring: string | null = null;
	dataFolderPath: string = `${this.manifest.dir}/${DATA_FOLDER}`;

	async onload() {
		this.addSettingTab(new JADOUSettingsTab(this.app, this));
		this.registerView(GLOSSARY_VIEW_TYPE, (leaf) => new GlossaryView(leaf));
		addCommands(this);

		initializePlugin(this);
	}

	onunload() {
		terminateWorker(this);
	}
}
