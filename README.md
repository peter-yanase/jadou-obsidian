# JADOU

JADOU is an evolving, in‑context Japanese language toolbox. You can look up readings and meanings, insert furigana, and build glossaries with it. Everything runs locally with no network access.

In Japanese, the right combination of kanji, readings, and meanings depend on context. JADOU groups these together to help you choose the right bundle for the text in front of you.

## Notable Features

- Mobile support
- PDF support
- Lineage (https://github.com/ycnmhd/obsidian-lineage) plugin support

## How to Use

- Select a Japanese expression _containing kanji_ and trigger the lookup command to open the dictionary panel. You can use the ribbon icon, the command panel, a keyboard shortcut, or the editor’s context menu to do this.
- The “common,” “rare,” “irregular,” and “outdated” tags next to the entries refer to the kana usage / readings. These guide you toward the most context-appropriate bundle.
- Select an entry and press <kb>Enter</kb>, or click it, to add it to your glossary.
- Drag around entries inside the glossary to reorder them.
- Drop an entry into the editor to copy it.
- Use the Sort button to reorder entries in Japanese alphabetical order.
- Right‑click an entry to remove it from the glossary.
- Press <kb>Space</kb> or right‑click an entry in the dictionary panel to insert furigana instead of adding it to the glossary.

## Design Choices

- Bulk operations are intentionally not supported.

## Roadmap

Feature requests, bug reports, and pull requests are welcome.

### Coming

- Support for traditional kanji forms.

### Planned

- Saving and loading glossaries.
- Kana-only lookup support.

## Security

- JADOU requires an internet connection only to download or update its dictionary data. It operates entirely offline otherwise and does not transmit or store your personal information.

### Dependencies

- [esbuild-plugin-inline-worker](https://github.com/mitschabaude/esbuild-plugin-inline-worker)
- [@patdx/kuromoji](https://github.com/patdx/kuromoji.js)

## Licenses & Acknowledgments

JADOU is available under the PolyForm-Perimeter v.1.0.1 license. Copyright (c) 2026 Peter Yanase

This project includes code derived from:

- Obsidian Sample Plugin (https://github.com/obsidianmd/obsidian-sample-plugin), licensed under the OBSD License. Copyright (c) 2020-2025 by Dynalist Inc.
- Obsidian Web Worker Example (https://github.com/RyotaUshio/obsidian-web-worker-example), licensed under the MIT License. Copyright (c) 2023 Ryota Ushio.

This software uses data derived from the JMdict/EDICT dictionary files, licensed under the CC-BY-SA-4.0 License. Copyright (c) 2000 Electronic Dictionary Research and Development Group.

This software uses a file from jmdict-simplified (https://github.com/scriptin/jmdict-simplified), licensed under the CC-BY-SA-4.0 License. Copyright (c) 2017-2026 Dmitry Shpika.

The furigana insertion logic was inspired by the implementation in kuroshiro (https://github.com/hexenq/kuroshiro), licensed under the MIT License. Copyright (c) 2015-2021 Hexen Qi.

Further licenses acknowledged in the dependencies are abbreviated here.
