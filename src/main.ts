import { Plugin, type Editor } from 'obsidian';

import JADOUWorker from 'jadou.worker';
import { addCommands } from 'ui/commands';
import { GlossaryView } from 'ui/glossarypanel';
import { JADOUSettingsTab } from 'ui/settingstab';
import { DATA_FOLDER, GLOSSARY_VIEW_TYPE } from 'utils/constants';
import { initializePlugin } from 'utils/plugininitalizer';
import { terminateWorker } from 'utils/worker-handler';

export default class JADOU extends Plugin {
	worker: Worker | null = new JADOUWorker();
	dictionaryReady: boolean = false;
	editorDuringLookUp: Editor | undefined = undefined;
	originalKeystring: string | null = null;
	dataFolderPath: string = `${this.manifest.dir}/${DATA_FOLDER}`;

	onload() {
		this.addSettingTab(new JADOUSettingsTab(this.app, this));
		this.registerView(GLOSSARY_VIEW_TYPE, (leaf) => new GlossaryView(leaf));
		addCommands(this);

		void initializePlugin(this);
	}

	onunload() {
		terminateWorker(this);
	}
}
