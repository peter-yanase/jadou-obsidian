import type { IpadicFeatures } from "@patdx/kuromoji";

export interface DataFile {
	name: string;
	url: string;
}

export type Tokenizer = {
	tokenize(text: string): IpadicFeatures[];
};

export type WorkerMessage =
  | { type: "init" }
  | { type: "build"; binaryData: ArrayBuffer }
  | { type: "ready" }
  | { type: "lookup"; keystring: string }
  | { type: "result"; entries: Entry[]; keystring: string };

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
