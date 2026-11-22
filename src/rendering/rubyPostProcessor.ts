import { sanitizeHTMLToDom } from 'obsidian';

import { MD_RUBY_SYNTAX } from 'const/constants';
import { convertRubySyntax } from 'utils/convertRubySyntax';

// Render ruby in reading mode
export function rubyPostProcessor(element: HTMLElement): void {
	// Skip early if there is no opening brace
	if (!element.innerText.includes(MD_RUBY_SYNTAX.head)) return;

	const walker: TreeWalker = activeDocument.createTreeWalker(
		element,
		// Only process nodes containing text
		NodeFilter.SHOW_TEXT,
	);
	const nodesToMutate: Text[] = [];
	while (walker.nextNode()) {
		const candidate: Node = walker.currentNode;
		if (!candidate.instanceOf(Text)) return;

		// Skip code blocks
		const parentTag: string | undefined = candidate.parentElement?.tagName;
		if (parentTag && parentTag === 'CODE') continue;

		nodesToMutate.push(candidate);
	}

	for (const node of nodesToMutate) {
		const originalText: string = node.nodeValue ?? '';
		const newText: string = convertRubySyntax(originalText, 'HTML');
		const safeFragment: DocumentFragment = sanitizeHTMLToDom(newText);
		node.replaceWith(safeFragment);
	}
}
