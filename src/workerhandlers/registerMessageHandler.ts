import { type DataAdapter } from 'obsidian';

import type JADOU from 'main';
import type { Tokenizer, WorkerMessage } from 'const/types';
import { handleBuild } from './handleBuild';
import { handleReady } from './handleReady';
import { handleResult } from './handleResult';

export function registerWorkerMessageHandler(
	plugin: JADOU,
	adapter: DataAdapter,
	dataFolderPath: string,
	worker: Worker,
	tokenizer: Tokenizer,
) {
	worker.onmessage = (event: MessageEvent<WorkerMessage>) => {
		const msg = event.data;

		switch (msg.type) {
			case 'build':
				void handleBuild(adapter, dataFolderPath, worker);
				break;
			case 'ready':
				handleReady(plugin);
				break;
			case 'result':
				handleResult(msg, tokenizer, worker, plugin);
				break;
		}
	};
}
