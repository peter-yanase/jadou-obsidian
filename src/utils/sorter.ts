export class Sorter {
	private listEl: HTMLElement;
	private draggingEl: HTMLElement | null = null;

	constructor(listEl: HTMLElement) {
		this.listEl = listEl;
		this.init();
	}

	private getTarget(event: DragEvent): HTMLElement | null {
		return (event.target as HTMLElement)?.closest("li.result");
	}

	private init() {
		this.listEl.addEventListener("dragstart", (event) => {
			this.draggingEl = this.getTarget(event);
		});

		this.listEl.addEventListener("dragend", () => {
			this.draggingEl = null;
		});

		this.listEl.addEventListener("dragover", (event) => {
			if (!this.draggingEl) return;
			// Allow dropping
			event.preventDefault();

			const targetEl = this.getTarget(event);
			if (!targetEl || targetEl === this.draggingEl) return;

			const targetRectangle = targetEl.getBoundingClientRect();
			const isAboveCenter =
				// Check if position is higher than the center of the rectangle
				event.clientY <
				targetRectangle.top + targetRectangle.height / 2;

			if (isAboveCenter) {
				this.listEl.insertBefore(this.draggingEl, targetEl);
			} else {
				this.listEl.insertAfter(this.draggingEl, targetEl);
			}
		});
	}
}
