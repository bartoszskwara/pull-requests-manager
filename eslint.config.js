import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  { ignores: ['dist'] },
  {
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommended
    ],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      "curly": ["error", "all"],
      "semi": ["error", "always"],
      "comma-style": ["error", "last"],
      "comma-spacing": ["error", { "before": false, "after": true }],
      "eol-last": ["error", "always"],
      "jsx-quotes": ["error", "prefer-double"],
      "key-spacing": ["error"],
      "func-call-spacing": ["error", "never"],
      "object-curly-spacing": ["error", "always"],
      "indent": ["error", 2],
    },
  },
)
