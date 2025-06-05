import type { ConfigArray } from 'typescript-eslint'

import {
  sheriff, type SheriffSettings, tseslint
} from 'eslint-config-sheriff'
import perfectionist from 'eslint-plugin-perfectionist'

const sheriffOptions: SheriffSettings = {
  'astro': false,
  'jest': false,
  'lodash': false,
  'next': false,
  'playwright': false,
  'react': false,
  'remeda': false,
  'storybook': true,
  'vitest': false
}

const ignores = [
    '**/node_modules/*',
    '**/types/*',
    'tsconfig.json',
    'player.js',
    'player-light.js'
  ],
  config: ConfigArray = tseslint.config(
    sheriff(sheriffOptions),
    {
      files: ['**/*.{ts,js}'],
      ignores,
      plugins: { perfectionist },
      rules: {
        '@stylistic/array-element-newline': ['warn', { minItems: 3 }],
        '@stylistic/comma-dangle': ['warn', 'only-multiline'],
        '@stylistic/comma-spacing': 'warn',
        '@stylistic/func-call-spacing': 'warn',
        '@stylistic/function-paren-newline': ['warn', { minItems: 3 }],
        '@stylistic/indent': ['warn', 2],
        '@stylistic/indent-binary-ops': ['warn', 2],
        '@stylistic/key-spacing': 'warn',
        '@stylistic/lines-between-class-members': ['warn', {
          enforce: [
            {
              blankLine: 'always',
              next: 'method',
              prev: 'method'
            }
          ]
        }],
        '@stylistic/no-extra-parens': 'warn',
        '@stylistic/no-multi-spaces': 'warn',
        '@stylistic/no-multiple-empty-lines': 'warn',
        '@stylistic/no-trailing-spaces': 'warn',
        '@stylistic/object-curly-newline': ['warn', {
          minProperties: 3,
          multiline: true
        }],
        '@stylistic/object-curly-spacing': ['warn', 'always'],
        '@stylistic/object-property-newline': 'warn',
        '@stylistic/quotes': ['warn', 'single'],
        '@stylistic/semi': ['warn', 'never'],
        '@stylistic/space-before-blocks': 'warn',
        '@stylistic/space-in-parens': 'warn',
        '@stylistic/type-annotation-spacing': 'warn',
        '@typescript-eslint/consistent-type-imports': ['error', { disallowTypeAnnotations: false }],
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        '@typescript-eslint/naming-convention': [
          'error',
          {
            format: ['camelCase', 'PascalCase'],
            leadingUnderscore: 'allowSingleOrDouble',
            selector: 'default',
            trailingUnderscore: 'forbid',
          },
          {
            format: ['camelCase'],
            leadingUnderscore: 'allowSingleOrDouble',
            modifiers: ['const'],
            selector: 'variable',
            trailingUnderscore: 'forbid',
            types: ['string', 'number'],
          },
          {
            format: null,
            leadingUnderscore: 'allowSingleOrDouble',
            selector: 'objectLiteralProperty',
            trailingUnderscore: 'forbid',
          },
          {
            format: ['PascalCase'],
            leadingUnderscore: 'forbid',
            selector: 'typeLike',
            trailingUnderscore: 'forbid',
          },
          {
            format: ['PascalCase'],
            leadingUnderscore: 'allowSingleOrDouble',
            prefix: [
              'is',
              'are',
              'has',
              'should',
              'can',
              'needs'
            ],
            selector: 'variable',
            trailingUnderscore: 'forbid',
            types: ['boolean'],
          },
          {
            format: null,
            modifiers: ['destructured'],
            selector: 'variable',
          },
          {
            format: null,
            selector: 'typeProperty',
          },
        ],
        '@typescript-eslint/no-explicit-any': 'warn',
        '@typescript-eslint/no-unnecessary-type-parameters': 0,
        '@typescript-eslint/no-unused-vars': [
          'error', {
            argsIgnorePattern: '^_',
            caughtErrors: 'none',
            caughtErrorsIgnorePattern: '^_',
            varsIgnorePattern: '^_',
          },
        ],
        '@typescript-eslint/no-use-before-define': ['error', {
          classes: false,
          functions: false
        }],
        '@typescript-eslint/restrict-template-expressions': [
          'error', { allowNumber: true },
        ],
        '@typescript-eslint/switch-exhaustiveness-check': ['error', { considerDefaultExhaustiveForUnions: true }],
        '@typescript-eslint/unbound-method': 0,
        'arrow-return-style/arrow-return-style': 0,
        'fsecond/prefer-destructured-optionals': 0,
        'func-style': 0,
        'no-plusplus': 'off',
        'no-restricted-globals': ['error',
          'event',
          'fdescribe'],
        'no-restricted-syntax/noAccessModifiers': 'off',
        'no-restricted-syntax/noClasses': 'off',
        'no-restricted-syntax/noEnums': 'off',
        'no-void': 'off',
        'operator-assignment': 0,
        'perfectionist/sort-classes': 'warn',
        'perfectionist/sort-enums': 'warn',
        'perfectionist/sort-imports': 'warn',
        'perfectionist/sort-interfaces': 'warn',
        'perfectionist/sort-objects': 'warn',
        'simple-import-sort/imports': 'off',
        'unicorn/no-array-reduce': ['error', { allowSimpleOperations: true }],
        'unicorn/prefer-query-selector': 'off',
        'unicorn/template-indent': 'warn'
      },
    },
    {
      extends: [tseslint.configs.disableTypeChecked],
      files: ['**/*.{js,mjs}'],
      ignores,
    }
  )

export default config