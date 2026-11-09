declare module 'worker/jadou.worker' {
	const WorkerFactory: new () => Worker;
	export default WorkerFactory;
}
