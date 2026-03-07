import type { Editor } from "obsidian";
import { Plugin } from "obsidian";
import { TokenizerBuilder } from "@patdx/kuromoji";
import JADOUWorker from "jadou.worker";
import { addCommands } from "./ui/commands.ts";
import { GlossaryView } from "./ui/glossarypanel.ts";
import { JADOUSettingsTab } from "./ui/settingstab.ts";
import {
	DATA_FILES,
	DATA_FOLDER,
	GLOSSARY_VIEW_TYPE,
} from "./utils/constants.ts";
import { setupWorker, terminateWorker } from "./utils/worker-handler.ts";
import { dictLoader } from "./utils/dictionaryloader.ts";
import { isDownloaded } from "utils/downloader.ts";

export default class JADOU extends Plugin {
	worker: Worker | null = new JADOUWorker();
	dictionaryReady: boolean = false;
	editorDuringLookup: Editor | undefined = undefined;
	originalKeystring: string | null = null;
	dataFolderPath: string | null = null;

	async onload() {
		const adapter = this.app.vault.adapter;
		this.dataFolderPath = `${this.manifest.dir}/${DATA_FOLDER}`;
		const folderExists = await adapter.exists(this.dataFolderPath)
		if (!folderExists) {
			await adapter.mkdir(this.dataFolderPath);
		}
		for (const dataFile of DATA_FILES) {
			const fileExists = await isDownloaded(this, adapter, dataFile);
			if (!fileExists) return;
		}
		const tokenizer = await new TokenizerBuilder({
			loader: new dictLoader(this),
		}).build();
		this.addSettingTab(new JADOUSettingsTab(this.app, this));
		addCommands(this);
		setupWorker(this, tokenizer);
		this.registerView(GLOSSARY_VIEW_TYPE, (leaf) => new GlossaryView(leaf));
	}

	onunload() {
		terminateWorker(this);
	}

	async getGlossaryView() {
		let glossaryLeaf =
			this.app.workspace.getLeavesOfType(GLOSSARY_VIEW_TYPE)[0] ?? null;
		if (!glossaryLeaf) {
			glossaryLeaf = await this.app.workspace.ensureSideLeaf(
				GLOSSARY_VIEW_TYPE,
				"right",
				{
					active: false,
				},
			);
		}
		await glossaryLeaf.setViewState({
			type: GLOSSARY_VIEW_TYPE,
		});
		return glossaryLeaf.view as GlossaryView;
	}
}
