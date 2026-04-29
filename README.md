# Rama 03-context — Rescatando el Carrito con Context API

Esta rama construye directamente sobre el código de `02-router`. Se extrae el estado del carrito a un `CartContext` global, eliminando por completo el Prop Drilling que se introdujo en la rama anterior.

---

## 🎯 Objetivo de esta rama

En `02-router`, `agregarAlCarrito` y `carrito` tenían que pasarse como props a cada componente de ruta. Aquí los envolvemos en un contexto para que cualquier componente en el árbol pueda acceder a ellos directamente, sin intermediarios.

---

## 🧠 Conceptos introducidos

### `createContext`
Crea el objeto de contexto. Es el "canal" por el que fluirán los datos.

```jsx
const CartContext = createContext(null)
```

### `<Provider>`
Componente que envuelve la app y pone el valor del contexto a disposición de todos sus descendientes.

```jsx
<CartContext.Provider value={{ carrito, agregarAlCarrito }}>
  {children}
</CartContext.Provider>
```

### `useContext`
Hook que permite a cualquier componente leer el valor del contexto más cercano.

```jsx
const { carrito, agregarAlCarrito } = useContext(CartContext)
```

### Custom hook `useCart`
En lugar de llamar `useContext(CartContext)` en cada componente, exportamos un hook que encapsula esa lógica.

```jsx
export function useCart() {
  return useContext(CartContext)
}

// Uso en cualquier componente:
const { carrito, agregarAlCarrito } = useCart()
```

---

## 🔄 Antes vs. Después

**Rama 02-router — con Prop Drilling:**
```jsx
// App.jsx
<Route path="/" element={<Catalogo carrito={carrito} agregarAlCarrito={agregarAlCarrito} />} />
<Route path="/galleta/:id" element={<DetalleCookie agregarAlCarrito={agregarAlCarrito} />} />

// Navbar.jsx
function Navbar({ cartCount }) { ... }

// Cart.jsx
function Cart({ items }) { ... }

// CookieCard.jsx
function CookieCard({ cookie, onAgregar }) { ... }
```

**Rama 03-context — con Context API:**
```jsx
// App.jsx
<CartProvider>
  <Route path="/" element={<Catalogo />} />
  <Route path="/galleta/:id" element={<DetalleCookie />} />
</CartProvider>

// Navbar.jsx
function Navbar() {
  const { carrito } = useCart()
}

// Cart.jsx
function Cart() {
  const { carrito } = useCart()
}

// CookieCard.jsx
function CookieCard({ cookie }) {
  const { agregarAlCarrito } = useCart()
}
```

---

## 📁 Estructura relevante

```
src/
├── App.jsx                     ← envuelto en <CartProvider>, sin props a las rutas
├── context/
│   └── CartContext.jsx         ← createContext, CartProvider, useCart
├── pages/
│   ├── Catalogo.jsx            ← sin props de carrito
│   └── DetalleCookie.jsx       ← usa useCart() directamente
└── components/
    ├── Navbar.jsx               ← usa useCart() directamente
    ├── Cart.jsx                 ← usa useCart() directamente
    └── CookieCard.jsx           ← usa useCart() directamente
```

---

## 🚀 Cómo ejecutar

```bash
cp docker-compose.example.yml docker-compose.yml
docker compose up --build
```

La aplicación estará disponible en `http://localhost:5173`.
