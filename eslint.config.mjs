import js from '@eslint/js';
import checkFile from 'eslint-plugin-check-file';
import prettier from 'eslint-plugin-prettier/recommended';
import reactCompiler from 'eslint-plugin-react-compiler';
import reactPlugin from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default [
	{
		ignores: ['dist', '**/*.js', 'eslint.config.mjs']
	},
	js.configs.recommended,
	...tseslint.configs.recommended,
	reactPlugin.configs.flat.recommended,
	reactPlugin.configs.flat['jsx-runtime'],
	prettier,
	{
		files: ['src/**/*.ts', 'src/**/*.tsx', 'vite.config.ts',],
		languageOptions: {
			parserOptions: {
				project: [path.join(__dirname, 'tsconfig.node.json'), path.join(__dirname, 'tsconfig.app.json')]
			},
			ecmaVersion: 2020,
			globals: globals.browser
		},
		plugins: {
			'react-hooks': reactHooks,
			'react-refresh': reactRefresh,
			'react-compiler': reactCompiler,
			'check-file': checkFile,
			'simple-import-sort': simpleImportSort
		},
		settings: {
			react: {
				version: 'detect'
			}
		},
		rules: {
			...reactHooks.configs.recommended.rules,
			'react-compiler/react-compiler': 'error',
			'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
			'prettier/prettier': ['error', { endOfLine: 'auto' }],
			'simple-import-sort/imports': 'warn',
			'no-unused-vars': 'off',
			'no-unused-expressions': 'off',
			'no-shadow': 'off',
			'@typescript-eslint/no-unused-vars': ['warn', { args: 'none', caughtErrors: 'none' }],
			'@typescript-eslint/no-unused-expressions': ['warn', { allowTernary: true, allowShortCircuit: true }],
			'@typescript-eslint/no-shadow': [
				'error',
				{
					ignoreTypeValueShadow: true,
					ignoreFunctionTypeParameterNameValueShadow: true,
					allow: ['T']
				}
			],
			'@typescript-eslint/naming-convention': [
				'error',
				{
					selector: 'variable',
					filter: '__typename',
					format: null
				},
				{
					selector: 'variable',
					types: ['function'],
					format: ['camelCase', 'PascalCase'],
					leadingUnderscore: 'allow'
				},
				{
					selector: 'variable',
					types: ['boolean', 'number', 'string', 'array'],
					format: ['camelCase', 'UPPER_CASE'],
					leadingUnderscore: 'allow'
				}
			],
			'react/prop-types': 'off',
			'check-file/filename-naming-convention': [
				'error',
				{ '**/*.{ts,tsx,css}': 'KEBAB_CASE' },
				{ ignoreMiddleExtensions: true }
			],
			'check-file/folder-naming-convention': ['error', { '*/**': 'KEBAB_CASE' }]
		}
	}
];
