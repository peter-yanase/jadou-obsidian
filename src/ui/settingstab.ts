import {
	PluginSettingTab,
	type App,
	type SettingDefinitionItem,
} from 'obsidian';

import type JADOU from 'main';
import { deleteCache } from 'utils/worker-handler';

export class JADOUSettingsTab extends PluginSettingTab {
	private plugin: JADOU;

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
