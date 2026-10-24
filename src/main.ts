import { Plugin, type Editor } from 'obsidian';

import JADOUWorker from 'jadou.worker';
import { addCommands } from 'ui/commands';
import { GlossaryView } from 'ui/GlossaryView';
import { JADOUSettingTab } from 'ui/JADOUSettingTab';
import { DATA_FOLDER, GLOSSARY_VIEW_TYPE } from 'const/constants';
import { initializePlugin } from 'utils/plugininitalizer';
import { terminateWorker } from 'utils/worker-handler';

export default class JADOU extends Plugin {
	worker: Worker | null = null;
	dictionaryReady = false;
	editorDuringLookUp?: Editor;
	originalKeystring = '';
	dataFolderPath = '';

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
