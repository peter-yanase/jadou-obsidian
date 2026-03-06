import type JADOU from "../main.ts";
import type { App } from "obsidian";
import { PluginSettingTab, Setting } from "obsidian";
import { deleteCache } from "../utils/worker-handler.ts";

export class JADOUSettingsTab extends PluginSettingTab {
	private plugin: JADOU;

	constructor(app: App, plugin: JADOU) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display() {
		const { containerEl } = this;
		containerEl.empty();

		new Setting(containerEl)
			.setName("Delete dictionary cache")
			.setDesc(
				"Clears the IndexedDB cache. The dictionary will rebuild on plugin reload.",
			)
			.addButton((button) =>
				button.setButtonText("Delete").onClick(async () => {
					await deleteCache(this.plugin);
				}),
			);
	}
}
