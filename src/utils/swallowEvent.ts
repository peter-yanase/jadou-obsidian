export function swallowEvent(event: KeyboardEvent | MouseEvent): void {
	event.preventDefault();
	event.stopPropagation();
}
