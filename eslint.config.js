import js from "@eslint/js"
import pluginReact from "eslint-plugin-react"
import pluginReactHooks from "eslint-plugin-react-hooks"
import pluginReactRefresh from "eslint-plugin-react-refresh"
import configPrettier from "eslint-config-prettier"
import globals from "globals"

export default [
  // Ignorar carpetas generadas y componentes shadcn/ui (código de terceros)
  { ignores: ["dist", "node_modules", "src/components/ui/**"] },

  // Archivos de contexto — mezclan Context, Provider y hook intencionalmente
  {
    files: ["src/context/**/*.{js,jsx}"],
    rules: {
      "react-refresh/only-export-components": "off",
    },
  },

  // Reglas base de JavaScript
  js.configs.recommended,

  // Configuración para archivos de la app
  {
    files: ["**/*.{js,jsx}"],
    plugins: {
      react: pluginReact,
      "react-hooks": pluginReactHooks,
      "react-refresh": pluginReactRefresh,
    },
    languageOptions: {
      ecmaVersion: 2020,
      globals: {
        ...globals.browser,
        ...globals.es2020,
      },
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    settings: {
      react: { version: "detect" },
    },
    rules: {
      // Reglas de React
      ...pluginReact.configs.recommended.rules,
      "react/react-in-jsx-scope": "off",    // No necesario con React 17+
      "react/prop-types": "off",            // Sin TypeScript, sin PropTypes

      // Reglas de hooks — CRÍTICAS: evitan bugs difíciles de detectar
      ...pluginReactHooks.configs.recommended.rules,

      // React Refresh (HMR) — allowConstantExport evita falsos positivos en archivos
      // que exportan contextos, hooks y componentes juntos (patrón común en Context files)
      "react-refresh/only-export-components": ["warn", { allowConstantExport: true, checkJS: false }],

      // Variables no usadas — warn, no error
      "no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],

      // console.log olvidados en el código
      "no-console": "warn",
    },
  },

  // Configuración específica para archivos de test
  {
    files: ["src/tests/**/*.{js,jsx}", "**/*.test.{js,jsx}"],
    languageOptions: {
      globals: {
        ...globals.browser,
        describe: "readonly",
        it: "readonly",
        expect: "readonly",
        vi: "readonly",
        beforeEach: "readonly",
        afterEach: "readonly",
        beforeAll: "readonly",
        afterAll: "readonly",
      },
    },
    rules: {
      "no-console": "off", // Permitir console en tests
    },
  },

  // Prettier al final — desactiva reglas de formato que Prettier maneja
  configPrettier,
]
