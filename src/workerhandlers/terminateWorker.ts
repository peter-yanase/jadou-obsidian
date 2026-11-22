import type JADOU from 'main';

export function terminateWorker(plugin: JADOU): void {
	if (!plugin.worker) return;
	plugin.worker.terminate();
	plugin.worker = null;
}
