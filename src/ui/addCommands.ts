import type JADOU from 'main';
import { lookUpCmds } from './commands/lookUpCmds';
import { selectSentenceCmds } from './commands/selectSentenceCmds';
import { convertToHTMLCmds } from './commands/convertToHTMLCmds';
import { convertToMDCmds } from './commands/convertToMDCmds';
import { copyWithoutRubyCmds } from './commands/copyWithoutRubyCmds';
import { removeRubyCmds } from './commands/removeRubyCmds';
import { wrapCmds } from './commands/wrapCmds';

// Wrapper function
export function addCommands(plugin: JADOU): void {
	for (const command of [
		...lookUpCmds,
		...selectSentenceCmds,
		...convertToHTMLCmds,
		...convertToMDCmds,
		...copyWithoutRubyCmds,
		...removeRubyCmds,
		...wrapCmds,
	]) {
		command(plugin);
	}
}
