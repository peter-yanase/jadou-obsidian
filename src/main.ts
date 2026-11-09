import { Plugin, type Editor } from 'obsidian';

import JADOUWorker from 'worker/jadou.worker';
import { addCommands } from 'ui/addCommands';
import { GlossaryView } from 'ui/GlossaryView';
import { JADOUSettingTab } from 'ui/JADOUSettingTab';
import { DATA_FOLDER, GLOSSARY_VIEW_TYPE } from 'const/constants';
import { initializePlugin } from 'utils/initializePlugin';
import { terminateWorker } from 'workerhandlers/terminateWorker';

export default class JADOU extends Plugin {
	worker: Worker | null = null;
	dictionaryReady = false;
	editorDuringLookUp?: Editor;
	originalKeystring?: string;
	dataFolderPath?: string;

	onload() {
		this.worker = new JADOUWorker();

		this.dataFolderPath = `${this.manifest.dir ?? ''}/${DATA_FOLDER}`;

		this.addSettingTab(new JADOUSettingTab(this.app, this));

		this.registerView(GLOSSARY_VIEW_TYPE, (leaf) => new GlossaryView(leaf));

		addCommands(this);

		void initializePlugin(this);
	}

	onunload() {
		terminateWorker(this);
	}
}
