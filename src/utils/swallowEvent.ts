export function swallowEvent(event: KeyboardEvent | MouseEvent) {
	event.preventDefault();
	event.stopPropagation();
}
