import type JADOU from "main.ts";
import { lookUpCmds } from "ui/commands/lookup.ts";
import { selectSentenceCmds } from "ui/commands/selectsentence.ts";

// Wrapper function
export function addCommands(plugin: JADOU) {
	for (const command of [...lookUpCmds, ...selectSentenceCmds]) {
		command(plugin);
	}
}
