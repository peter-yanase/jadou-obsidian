import {
	HTML_RUBY_REGEX,
	HTML_RUBY_SYNTAX,
	MD_RUBY_REGEX,
	MD_RUBY_SYNTAX,
} from 'const/constants';
import type { ProtectedText, Syntax, SyntaxType } from 'const/types';
import { replaceRuby } from './replaceRuby';
import { protectCode } from './protectCode';
import { restoreProtectedSpans } from './restoreProtectedSpans';

export function convertRubySyntax(
	originalText: string,
	targetSyntax: SyntaxType,
): string {
	const { textWithPlaceholders, protectedSpans }: ProtectedText =
		protectCode(originalText);

	const { head, divider, tail }: Syntax =
		targetSyntax === 'HTML' ? HTML_RUBY_SYNTAX : MD_RUBY_SYNTAX;
	const { head: sourceHead }: Syntax =
		targetSyntax === 'HTML' ? MD_RUBY_SYNTAX : HTML_RUBY_SYNTAX;
	const regex: RegExp =
		targetSyntax === 'HTML' ? MD_RUBY_REGEX : HTML_RUBY_REGEX;

	let mutatedText: string = replaceRuby(
		textWithPlaceholders,
		sourceHead,
		regex,
		(_match, base, ruby) => `${head}${base}${divider}${ruby}${tail}`,
	);

	mutatedText = restoreProtectedSpans(mutatedText, protectedSpans);
	return mutatedText;
}
