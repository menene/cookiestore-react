# Rama 05-reducers — Lógica Compleja del Carrito

Esta rama construye directamente sobre el código de `04-hooks`. El `CartContext` creció: ahora maneja cantidades, eliminación específica, vaciado y favoritos. Múltiples `useState` dispersos causarían bugs difíciles de rastrear — la solución es centralizar toda la lógica en un reducer.

---

## 🎯 Objetivo de esta rama

Reemplazar el `useState` del carrito por un `useReducer` con acciones explícitas. Cualquier cambio al estado pasa por una sola función pura, lo que hace el flujo predecible y fácil de depurar.

---

## 🧠 Conceptos introducidos

### `useReducer`
Alternativa a `useState` para estado complejo. Recibe un reducer y un estado inicial, devuelve el estado actual y `dispatch`.

```js
const [state, dispatch] = useReducer(cartReducer, initialState)
```

### El Reducer
Función pura `(state, action) => newState`. Nunca muta el estado — siempre retorna un objeto nuevo.

```js
function cartReducer(state, action) {
  switch (action.type) {
    case "ADD_COOKIE": { ... }
    case "REMOVE_COOKIE": { ... }
    case "UPDATE_QUANTITY": { ... }
    case "CLEAR_CART": { ... }
    case "TOGGLE_FAVORITE": { ... }
    default: return state
  }
}
```

### `dispatch`
La única forma de modificar el estado. Se llama con un objeto `action` que tiene `type` y opcionalmente `payload`.

```js
dispatch({ type: "ADD_COOKIE",      payload: cookie })
dispatch({ type: "REMOVE_COOKIE",   payload: id })
dispatch({ type: "UPDATE_QUANTITY", payload: { id, cantidad: 3 } })
dispatch({ type: "CLEAR_CART" })
dispatch({ type: "TOGGLE_FAVORITE", payload: id })
```

### Funciones semánticas
Los componentes no llaman `dispatch` directamente — usan funciones con nombres claros que lo envuelven internamente.

```js
const agregarAlCarrito   = (cookie) => dispatch({ type: "ADD_COOKIE", payload: cookie })
const eliminarDelCarrito = (id)     => dispatch({ type: "REMOVE_COOKIE", payload: id })
const actualizarCantidad = (id, n)  => dispatch({ type: "UPDATE_QUANTITY", payload: { id, cantidad: n } })
const vaciarCarrito      = ()       => dispatch({ type: "CLEAR_CART" })
const toggleFavorito     = (id)     => dispatch({ type: "TOGGLE_FAVORITE", payload: id })
```

---

## ✨ Novedades en la UI

- **Página `/cart`** — carrito dedicado con controles de cantidad por item
- **Favoritos** — corazón en cada tarjeta, filtro "Favoritas" en el catálogo
- **Badge en Navbar** — muestra el total de items (sumando cantidades)
- **Items sin duplicados** — `ADD_COOKIE` incrementa la cantidad si el item ya existe

---

## 📁 Estructura relevante

```
src/
├── context/
│   └── CartContext.jsx     ← useReducer, 5 acciones, persistencia en localStorage
├── pages/
│   ├── Catalogo.jsx        ← filtro de favoritas, grid ancho completo
│   ├── CartPage.jsx        ← página dedicada del carrito (nueva)
│   └── DetalleCookie.jsx   ← sin cambios
└── components/
    ├── CookieCard.jsx      ← botón de favorito (corazón)
    └── Navbar.jsx          ← badge con totalItems, link a /cart
```

---

## 🚀 Cómo ejecutar

```bash
cp .env.example .env
cp docker-compose.example.yml docker-compose.yml
docker compose up --build
```

La aplicación estará disponible en `http://localhost:5173`.
