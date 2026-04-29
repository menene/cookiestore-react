import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import eslint from "vite-plugin-eslint2"
import { fileURLToPath, URL } from "node:url"

export default defineConfig({
  plugins: [
    react(),
    // Integra ESLint en el dev server — los errores aparecen en la terminal
    // y en el overlay del navegador mientras desarrollas, sin correr ningún comando.
    eslint({
      emitWarningAsError: false, // No crashear el servidor al encontrar errores
    }),
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  // Configuración de Vitest — comparte el mismo proceso que Vite
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/tests/setup.js",
  },
})
