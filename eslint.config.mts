import obsidianmd from 'eslint-plugin-obsidianmd';
import globals from 'globals';
import { globalIgnores, defineConfig } from 'eslint/config';
import tseslint from 'typescript-eslint';

export default defineConfig(
    globalIgnores([
        'build',
        'node_modules',
        'esbuild.config.mjs',
        'eslint.config.mts',
        'package.json',
        'package-lock.json',
        'tsconfig.json',
        'versions.json',
    ]),
    {
        extends: [
            tseslint.configs.strictTypeChecked,
            tseslint.configs.stylisticTypeChecked,
        ],
        languageOptions: {
            globals: {
                ...globals.browser,
            },
            parserOptions: {
                projectService: {
                    allowDefaultProject: ['eslint.config.mts', 'manifest.json'],
                },
                tsconfigRootDir: import.meta.dirname,
                extraFileExtensions: ['.json'],
            },
        },
    },
    ...obsidianmd.configs.recommended,
);
