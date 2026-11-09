import type JADOU from 'main';

export function terminateWorker(plugin: JADOU) {
	if (!plugin.worker) return;
	plugin.worker.terminate();
	plugin.worker = null;
}
