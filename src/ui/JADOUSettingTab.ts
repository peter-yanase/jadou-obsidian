import {
	PluginSettingTab,
	type App,
	type SettingDefinitionItem,
} from 'obsidian';

import type JADOU from 'main';
import { deleteCache } from 'workerhandlers/deleteCache';

export class JADOUSettingTab extends PluginSettingTab {
	plugin: JADOU;

	constructor(app: App, plugin: JADOU) {
		super(app, plugin);
		this.plugin = plugin;
	}

	getSettingDefinitions(): SettingDefinitionItem[] {
		return [
			{
				name: 'Delete dictionary cache',
				render: (setting) => {
					setting.addButton((button) =>
						button
							.setIcon('trash-2')
							.setButtonText('Delete')
							.onClick(async () => {
								await deleteCache(this.plugin);
							}),
					);
				},
			},
		];
	}
}
