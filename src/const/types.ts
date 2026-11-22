import { type IpadicFeatures } from '@patdx/kuromoji';

export interface ProtectedText {
	textWithPlaceholders: string;
	protectedSpans: string[];
}

export interface DataFile {
	name: string;
	url: string;
}

export interface Tokenizer {
	tokenize(text: string): IpadicFeatures[];
}

interface InitMessage {
	type: 'init';
}

interface BuildMessage {
	type: 'build';
	binaryData: ArrayBuffer;
}

interface ReadyMessage {
	type: 'ready';
}

interface LookupMessage {
	type: 'lookup';
	keystring: string;
}

interface ResultMessage {
	type: 'result';
	entries: Entry[];
	keystring: string;
}

export type WorkerMessage =
	| InitMessage
	| BuildMessage
	| ReadyMessage
	| LookupMessage
	| ResultMessage;

export interface Kanji {
	text: string;
	tags: string[];
}

export interface Kana {
	text: string;
	tags: string[];
	appliesToKanji: string[];
	common: boolean;
}

export interface Gloss {
	text: string;
}

export interface Sense {
	appliesToKana: string[];
	appliesToKanji: string[];
	gloss: Gloss[];
	dialect: string[];
	misc: string[];
}

export interface Entry {
	id: number;
	kanji: Kanji[];
	kana: Kana[];
	sense: Sense[];
}

export interface DictionaryObject {
	words: Entry[];
}

export interface SemanticUnit {
	kanji: string;
	kana: string;
	kanjiTags: string[];
	kanaTags: string[];
	kanaCommon: boolean;
	senses: Sense[];
}

export interface Settings {
	smartarrowkeys: boolean;

	lv1BaseColor: string;
	lv1RubyColor: string;
	lv1RubySize: number;
	lv1RubyPosition: string;
	lv1RubyRelativeOffset: number;
	lv1RubyDistribution: string;

	lv2BaseColor: string;
	lv2RubyColor: string;
	lv2RubySize: number;
	lv2RubyPosition: string;
	lv2RubyRelativeOffset: number;
	lv2RubyDistribution: string;
}

export type Jump = undefined | 'left' | 'right';

export interface Ruby {
	start: number;
	end: number;
	base: string;
	ruby: string;
}

export type SyntaxType = 'HTML' | 'MD';

export interface Syntax {
	head: string;
	divider: string;
	tail: string;
}
