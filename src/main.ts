import { Plugin, type Editor } from 'obsidian';

import JADOUWorker from 'worker/jadou.worker';
import { addCommands } from 'ui/addCommands';
import { GlossaryView } from 'ui/GlossaryView';
import { JADOUSettingTab } from 'ui/JADOUSettingTab';
import {
	DATA_FOLDER,
	DEFAULT_SETTINGS,
	GLOSSARY_VIEW_TYPE,
} from 'const/constants';
import { initializePlugin } from 'utils/initializePlugin';
import { terminateWorker } from 'workerhandlers/terminateWorker';
import { rubyPostProcessor } from 'rendering/rubyPostProcessor';
import { rubyRenderingExtension } from 'rendering/rubyRenderingExtension';
import { smartArrowkeysExtension } from 'ui/smartArrowkeysExtension';
import type { Jump, Settings } from 'const/types';
import { setCSSVariables } from 'utils/setCSSVariables';
import { startRubyClassHandler } from 'utils/startRubyClassHandler';

export default class JADOU extends Plugin {
	declare settings: Settings;
	worker: Worker | null = null;
	dictionaryReady: boolean = false;
	editorDuringLookUp?: Editor;
	originalKeystring?: string;
	dataFolderPath?: string;
	lastJump?: Jump;

	async onload(): Promise<void> {
		this.worker = new JADOUWorker();

		this.dataFolderPath = `${this.manifest.dir ?? ''}/${DATA_FOLDER}`;

		await this.loadSettings();

		this.addSettingTab(new JADOUSettingTab(this.app, this));

		this.registerEditorExtension(rubyRenderingExtension);

		this.registerEditorExtension(smartArrowkeysExtension(this));

		this.registerMarkdownPostProcessor(rubyPostProcessor);

		this.registerView(GLOSSARY_VIEW_TYPE, (leaf) => new GlossaryView(leaf));

		addCommands(this);

		setCSSVariables(this.settings);

		startRubyClassHandler(activeDocument);

		void initializePlugin(this);
	}

	onunload(): void {
		terminateWorker(this);
	}

	async loadSettings(): Promise<void> {
		this.settings = Object.assign(
			{},
			DEFAULT_SETTINGS,
			await this.loadData(),
		);
	}

	async saveSettings(): Promise<void> {
		await this.saveData(this.settings);
	}
}
