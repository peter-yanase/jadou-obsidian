import type { WorkerMessage } from 'const/types';
import { init } from './init';
import { build } from './build';
import { lookup } from './lookup';

onmessage = (event: MessageEvent<WorkerMessage>) => {
	const message = event.data;

	switch (message.type) {
		case 'init':
			void init();
			break;
		case 'build':
			void build(message);
			break;
		case 'lookup':
			void lookup(message);
			break;
	}
};
