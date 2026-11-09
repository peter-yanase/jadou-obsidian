import type JADOU from 'main';
import { lookUpCmds } from 'ui/commands/lookUpCmds';
import { selectSentenceCmds } from 'ui/commands/selectSentenceCmds';

// Wrapper function
export function addCommands(plugin: JADOU) {
	for (const command of [...lookUpCmds, ...selectSentenceCmds]) {
		command(plugin);
	}
}
