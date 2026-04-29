# Rama 07-testing — Linting, Formateo y Tests

Esta rama construye directamente sobre el código de `06-forms`. No agrega features nuevas — agrega las herramientas que hacen que el código sea **mantenible, confiable y profesional**.

---

## Por qué esto importa

En las ramas anteriores verificabas el comportamiento manualmente: abrías el navegador, hacías clic, revisabas que todo se viera bien. Eso funciona cuando el proyecto es pequeño. Pero a medida que el código crece, se vuelve insostenible.

**Sin tests:**
- Refactorizar da miedo — cualquier cambio puede romper algo silenciosamente
- Los bugs llegan a producción antes de que los encuentres
- Perdes confianza en tu propio código

**Sin linter:**
- El estilo es inconsistente entre archivos y personas
- Errores obvios (variables sin usar, dependencias faltantes en `useEffect`) pasan desapercibidos
- Los code reviews se llenan de comentarios de estilo en lugar de lógica

En proyectos reales, un codebase sin tests ni linter es deuda técnica garantizada.

---

## Herramientas instaladas

### ESLint v9 (flat config)

Analiza el código estáticamente para encontrar errores y malas prácticas **antes de ejecutar el código**. Esta rama usa el nuevo formato `eslint.config.js` (ESLint v9), reemplazando el viejo `.eslintrc`.

- Plugins: `react`, `react-hooks`, `react-refresh`
- Se ejecuta en tiempo real en el dev server via `vite-plugin-eslint2`
- Configuración separada para archivos de test (globals de Vitest)

```bash
npm run lint          # revisa todos los archivos en src/
npm run lint:fix      # corrige automáticamente lo que puede
```

### Prettier

Formatea el código automáticamente con reglas fijas. No hay debate sobre comillas, punto y coma o indentación — Prettier lo decide y punto.

- Configuración: `.prettierrc`
- Compatible con ESLint via `eslint-config-prettier` (evita conflictos de reglas)

```bash
npm run format        # formatea todos los archivos en src/
```

### Vitest + React Testing Library

Framework de tests diseñado para Vite. Comparte la misma configuración del proyecto (alias `@/`, variables de entorno, JSX transform) sin config extra.

React Testing Library fuerza a testear como un usuario real: busca elementos por texto, rol o aria-label, no por clases CSS o estructura del DOM.

```bash
npm run test          # modo watch — re-ejecuta al guardar
npm run test:run      # una sola ejecución (para CI)
npm run test:ui       # interfaz visual en el navegador
```

---

## Qué cambia en el código existente

### Nuevo: `src/reducers/cartReducer.js`

El reducer fue **extraído de CartContext** a su propio archivo. Esto permite importarlo en tests sin montar ningún componente ni provider.

```
# Antes (06-forms)
src/context/CartContext.jsx  ← tenía el reducer inline

# Ahora (07-testing)
src/reducers/cartReducer.js  ← función pura, testeable en aislamiento
src/context/CartContext.jsx  ← importa desde cartReducer.js
```

### Modificado: `src/context/CartContext.jsx`

`CartContext` ahora tiene **named export**. Esto permite que los tests inyecten un contexto mockeado directamente, sin usar el CartProvider real.

```js
// Antes: solo se podía consumir via useCart()
// Ahora: los tests pueden proveer su propio valor
<CartContext.Provider value={mockCartContext}>
  <ComponenteBajoTest />
</CartContext.Provider>
```

### Modificado: `src/components/CookieCard.jsx`

Se añadió `aria-label` al botón de favoritos. Esto sirve dos propósitos: accesibilidad correcta para lectores de pantalla, y tests robustos que no dependen de estructura HTML frágil.

```jsx
aria-label={favorito ? "Quitar de favoritas" : "Agregar a favoritas"}
```

---

## Los tests explicados

### `cartReducer.test.js` — funciones puras

El reducer es el candidato ideal para tests unitarios: dado un estado y una acción, siempre devuelve el mismo resultado. Sin efectos secundarios, sin DOM, sin mocks.

```js
it("incrementa la cantidad si la galleta ya existe en el carrito", () => {
  const conUna = cartReducer(initialState, { type: "ADD_COOKIE", payload: mockCookie })
  const conDos = cartReducer(conUna, { type: "ADD_COOKIE", payload: mockCookie })
  expect(conDos.carrito[0].cantidad).toBe(2)
})
```

Cubre las 5 acciones: ADD_COOKIE, REMOVE_COOKIE, UPDATE_QUANTITY, CLEAR_CART, TOGGLE_FAVORITE.

### `useDebounce.test.js` — custom hooks con tiempo controlado

`vi.useFakeTimers()` reemplaza `setTimeout` con una versión controlable. Avanzas el tiempo manualmente sin esperar milisegundos reales. El test más importante verifica que la cleanup function de `useEffect` funciona — si no cancelara el timer anterior, los cambios rápidos dejarían timers colgados.

```js
rerender({ value: "b" })
rerender({ value: "c" })
rerender({ value: "d" })

act(() => vi.advanceTimersByTime(300))
expect(result.current).toBe("d") // solo el último valor llegó
```

### `CookieCard.test.jsx` — componentes con contexto

Verifica que el componente renderiza la información correcta y que las interacciones del usuario llaman a las funciones correctas. Usa `renderWithProviders` para proveer Router + CartContext sin repetir boilerplate en cada test.

```js
it("llama a agregarAlCarrito con la galleta correcta al hacer clic en Agregar", () => {
  const agregarAlCarrito = vi.fn()
  renderWithProviders(<CookieCard cookie={mockCookie} />, {
    cartValue: { ...mockCartContext, agregarAlCarrito },
  })

  fireEvent.click(screen.getByText("Agregar"))
  expect(agregarAlCarrito).toHaveBeenCalledWith(mockCookie)
})
```

### `Navbar.test.jsx` — navegación y estado del carrito

Verifica que el badge muestra la suma correcta de cantidades, que no aparece con carrito vacío, que muestra "9+" cuando hay más de 9 items, y que los enlaces apuntan a las rutas correctas.

---

## Utilidades de test

### `src/tests/setup.js`

Se ejecuta antes de cada suite. Importa los matchers de `@testing-library/jest-dom` para poder usar `toBeInTheDocument()`, `toHaveAttribute()`, etc.

### `src/tests/utils.jsx`

Evita repetir la misma estructura en cada test. `renderWithProviders` envuelve cualquier componente con MemoryRouter + CartContext.Provider. `mockCartContext` provee funciones spy (`vi.fn()`) que registran cómo fueron llamadas.

```jsx
export function renderWithProviders(ui, { cartValue = mockCartContext, route = "/" } = {}) {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <CartContext.Provider value={cartValue}>{ui}</CartContext.Provider>
    </MemoryRouter>
  )
}
```

---

## Estructura de archivos

```
src/
├── reducers/
│   └── cartReducer.js          ← NUEVO: reducer extraído para testear en aislamiento
├── tests/
│   ├── setup.js                ← NUEVO: configura jest-dom matchers
│   ├── utils.jsx               ← NUEVO: renderWithProviders + mockCartContext
│   ├── cartReducer.test.js     ← NUEVO: 15 tests del reducer puro
│   ├── useDebounce.test.js     ← NUEVO: 5 tests con fake timers
│   ├── CookieCard.test.jsx     ← NUEVO: 7 tests del componente
│   └── Navbar.test.jsx         ← NUEVO: 7 tests de navegación y badge
eslint.config.js                ← NUEVO: ESLint v9 flat config
.prettierrc                     ← NUEVO: config de Prettier
.prettierignore                 ← NUEVO
vite.config.js                  ← MODIFICADO: test config + vite-plugin-eslint2
package.json                    ← MODIFICADO: nuevas dependencias y scripts
```

---

## Conceptos clave

| Concepto | Qué hace |
|----------|----------|
| `describe` / `it` | Agrupa y nombra los tests |
| `expect().toBe()` | Aserción de igualdad estricta |
| `expect().toBeInTheDocument()` | Verifica presencia en el DOM |
| `screen.getByText()` | Busca elementos como los buscaría un usuario |
| `fireEvent.click()` | Simula una interacción del usuario |
| `vi.fn()` | Crea un spy — función fake que registra sus llamadas |
| `vi.useFakeTimers()` | Reemplaza setTimeout con versión controlable |
| `renderHook()` | Monta un hook sin necesitar un componente |
| `act()` | Envuelve acciones que causan actualizaciones de estado |

---

## Rama anterior vs esta rama

| Aspecto | 06-forms | 07-testing |
|---------|----------|------------|
| Verificación de comportamiento | Manual en el navegador | Automática con `npm run test` |
| Calidad de código | Criterio personal | ESLint impone reglas del equipo |
| Formato del código | Inconsistente | Prettier lo normaliza todo |
| Refactor seguro | No — da miedo romper cosas | Si — los tests confirman que todo sigue funcionando |
| CI/CD listo | No | Si — `npm run test:run` falla con exit code 1 si hay errores |

---

## Cómo ejecutar

```bash
cp .env.example .env
cp docker-compose.example.yml docker-compose.yml
docker compose up --build
```

La aplicación estará disponible en `http://localhost:5173`.

```bash
# Dentro del contenedor o localmente:
npm run test          # tests en watch mode
npm run lint          # revisa el código
npm run format        # formatea el código
```

---

## Proxima rama: `08-performance`

`React.memo`, `useMemo`, `useCallback`, `React.lazy` + `Suspense`. Cuándo optimizar y cuándo no optimizar.
