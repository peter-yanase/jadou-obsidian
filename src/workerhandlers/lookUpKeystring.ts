import { Notice } from 'obsidian';

import type JADOU from 'main';

export function lookUpKeystring(plugin: JADOU) {
	const worker = plugin.worker;
	if (!worker) {
		new Notice('Reload the plugin!');
		return;
	}

	if (!plugin.dictionaryReady) {
		new Notice('Database not ready');
		return;
	}

	worker.postMessage({
		type: 'lookup',
		keystring: plugin.originalKeystring,
	});
}
