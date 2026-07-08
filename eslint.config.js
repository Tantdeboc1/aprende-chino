import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist', '.claude', 'node_modules', 'design_handoff_jade_pop_rojo', 'scripts']),
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs['recommended-latest'],
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    rules: {
      'no-unused-vars': ['error', {
        varsIgnorePattern: '^[A-Z_]',
        argsIgnorePattern: '^_',
        caughtErrors: 'none',
      }],
      'no-empty': ['error', { allowEmptyCatch: true }],
      // DX-only (Fast Refresh); agrupar varios componentes/constantes en un
      // archivo no es un error de corrección.
      'react-refresh/only-export-components': 'warn',
    },
  },
  {
    // Archivos que corren en Node (configs de build y tests E2E): tienen
    // `process`, etc. — no aplicamos el entorno de navegador aquí.
    files: ['vite.config.js', 'playwright.config.js', 'e2e/**/*.{js,jsx}'],
    languageOptions: { globals: globals.node },
  },
])
