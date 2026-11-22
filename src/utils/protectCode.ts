import { CODE_REGEX, PLACEHOLDER_SYNTAX } from 'const/constants';
import type { ProtectedText } from 'const/types';

export function protectCode(text: string): ProtectedText {
	const protectedSpans: string[] = [];

	const textWithPlaceholders: string = text.replace(CODE_REGEX, (match) => {
		protectedSpans.push(match);
		return `${PLACEHOLDER_SYNTAX.head ?? ''}${(protectedSpans.length - 1).toString()}${PLACEHOLDER_SYNTAX.tail ?? ''}`;
	});

	return { textWithPlaceholders, protectedSpans };
}
