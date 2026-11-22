export function getTarget(event: DragEvent): HTMLElement | null {
	const target: EventTarget | null = event.target;
	if (!(target instanceof HTMLElement)) return null;
	return target.closest('li.result');
}
