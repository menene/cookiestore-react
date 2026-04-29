# Rama 04-hooks — Datos Reales y Ciclo de Vida

Esta rama construye directamente sobre el código de `03-context`. Los datos del catálogo dejan de estar hardcodeados en el código y pasan a cargarse desde una API real. Se agrega un buscador con auto-focus para demostrar el acceso directo al DOM.

---

## 🎯 Objetivo de esta rama

Simular el flujo real de una aplicación: los datos llegan de forma asíncrona desde un servidor. Al hacerlo aparecen nuevos problemas — ¿cuándo se hace el fetch? ¿qué se muestra mientras carga? ¿cómo se optimiza el buscador?

---

## 🧠 Conceptos introducidos

### `useEffect`
Ejecuta código como efecto secundario del ciclo de vida del componente. Con un array de dependencias vacío `[]`, se ejecuta **una sola vez** al montar.

```jsx
useEffect(() => {
  fetch(API_URL)
    .then(res => res.json())
    .then(data => setCookies(data))
}, []) // <- solo al montar
```

Puedes ver la petición real en el **Network tab** del navegador.

### `useRef`
Crea una referencia mutable a un nodo del DOM. A diferencia de `useState`, cambiar `ref.current` **no provoca un re-render**.

```jsx
const inputRef = useRef(null)

// Enfocamos el input cuando los datos terminan de cargar
useEffect(() => {
  if (!loading && inputRef.current) {
    inputRef.current.focus()
  }
}, [loading])

// Conectamos la ref al elemento del DOM
<input ref={inputRef} />
```

### Custom hook `useFetchCookies`
Encapsula el fetch, el estado de carga y el manejo de errores en un hook reutilizable. Cualquier componente que necesite las galletas lo llama directamente.

```jsx
// src/hooks/useFetchCookies.js
export function useFetchCookies() {
  const [cookies, setCookies] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => { /* fetch */ }, [])

  return { cookies, loading, error }
}

// Uso en cualquier componente:
const { cookies, loading, error } = useFetchCookies()
```

### `useDebounce`
Retrasa la actualización de un valor hasta que el usuario deja de cambiarlo. Demuestra la **cleanup function** de `useEffect` — el concepto más importante que añade esta rama.

```js
export function useDebounce(value, delay = 300) {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay)
    return () => clearTimeout(timer) // <- cleanup: cancela el timer anterior
  }, [value, delay])

  return debouncedValue
}
```

Sin el `return () => clearTimeout(timer)`, cada tecla acumularía un timer sin limpiar (memory leak).

### `useLocalStorage`
Reemplazo directo de `useState` que persiste el valor en `localStorage`. Demuestra `useEffect` con **dependencias**: el efecto re-corre cada vez que el valor cambia.

```js
const [carrito, setCarrito] = useLocalStorage("cookiestore-carrito", [])
// El carrito sobrevive recargas de página — pruébalo añadiendo galletas y recargando.
```

### Filtrado client-side
El buscador **no genera peticiones adicionales**. Una vez cargados los datos, el filtrado ocurre en memoria con `.filter()`.

```
Carga inicial → useEffect → fetch(API) → setCookies(data)   ← 1 petición real
Búsqueda      → useState  → cookies.filter(...)             ← 0 peticiones
```

---

## 📁 Estructura relevante

```
src/
├── hooks/
│   ├── useFetchCookies.js   ← useEffect + fetch + VITE_API_URL
│   ├── useDebounce.js       ← useEffect con cleanup function
│   └── useLocalStorage.js   ← useEffect con dependencias
├── pages/
│   ├── Catalogo.jsx         ← useFetchCookies + useState (buscador) + useRef (focus)
│   └── DetalleCookie.jsx    ← reutiliza useFetchCookies
└── data/
    └── cookies.js           ← vacío, los datos ahora vienen de la API
```

---

## ⚙️ Variables de entorno

Copia el archivo de ejemplo y completa la URL de la API:

```bash
cp .env.example .env
```

| Variable | Descripción |
|---|---|
| `VITE_API_URL` | URL del JSON con el catálogo de galletas |

Vite expone las variables con prefijo `VITE_` al navegador a través de `import.meta.env`.

---

## 🚀 Cómo ejecutar

```bash
cp docker-compose.example.yml docker-compose.yml
docker compose up --build
```

La aplicación estará disponible en `http://localhost:5173`.

Abre el **Network tab** en las DevTools del navegador y recarga la página. Verás la petición GET al catálogo de galletas.
