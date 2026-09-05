import type JADOU from 'main';
import { lookUpCmds } from 'ui/commands/lookup';
import { selectSentenceCmds } from 'ui/commands/selectsentence';

// Wrapper function
export function addCommands(plugin: JADOU) {
	for (const command of [...lookUpCmds, ...selectSentenceCmds]) {
		command(plugin);
	}
}
