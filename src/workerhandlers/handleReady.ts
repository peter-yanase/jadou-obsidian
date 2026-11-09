import { Notice } from 'obsidian';

import type JADOU from 'main';

export function handleReady(plugin: JADOU) {
	plugin.dictionaryReady = true;
	new Notice('Dictionary ready to use');
}
