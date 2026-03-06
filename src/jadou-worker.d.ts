declare module "jadou.worker" {
	const WorkerFactory: new () => Worker;
	export default WorkerFactory;
}
