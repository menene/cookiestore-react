# Rama 01-intro — Catálogo Estático y Estado Local

Esta es la rama de partida del recorrido. Se construye la versión más simple posible de CookieStore: un catálogo de galletas con un carrito de compras básico, todo en un solo componente raíz usando `useState`.

---

## 🎯 Objetivo de esta rama

Construir la interfaz principal de la tienda desde cero. El catálogo muestra un array estático de galletas y el carrito acumula los items seleccionados. No hay rutas, no hay contexto global, no hay librerías de estado — solo React puro.

---

## 🧠 Conceptos introducidos

### `useState`
Hook que permite a un componente recordar valores entre renders. Devuelve el valor actual y una función para actualizarlo.

```jsx
const [carrito, setCarrito] = useState([])
```

Cada vez que se llama a `setCarrito`, React vuelve a renderizar el componente con el nuevo valor.

### Inmutabilidad del estado
React detecta cambios comparando referencias. Por eso nunca se muta el array directamente — se crea uno nuevo con el spread operator:

```jsx
const agregarAlCarrito = (cookie) => {
  setCarrito([...carrito, cookie])
}
```

`push()` mutaría el array original y React no detectaría el cambio. El spread crea un nuevo array con todos los items anteriores más el nuevo.

### `.map()` para renderizar listas
Transforma cada objeto del array de galletas en un componente `CookieCard`. La prop `key` es obligatoria para que React identifique cada elemento de forma única.

```jsx
{cookies.map((cookie) => (
  <CookieCard
    key={cookie.id}
    cookie={cookie}
    onAgregar={agregarAlCarrito}
  />
))}
```

### Props: datos y funciones
Los componentes hijos reciben información a través de props. En esta rama, `App` le pasa dos cosas a `CookieCard`:

- `cookie` → el objeto con los datos de la galleta (nombre, precio, emoji, etc.)
- `onAgregar` → la función que actualiza el carrito en `App`

```jsx
// CookieCard.jsx
function CookieCard({ cookie, onAgregar }) {
  return (
    <Button onClick={() => onAgregar(cookie)}>Agregar</Button>
  )
}
```

El hijo no modifica el estado directamente — llama a la función del padre, que es quien tiene el estado.

### `Array.reduce` para calcular el total
El carrito calcula su total sumando el precio de cada item:

```jsx
const total = items.reduce((suma, item) => suma + item.precio, 0)
```

---

## ⚠️ Limitaciones intencionales

- El carrito permite duplicados — agregar la misma galleta dos veces crea dos entradas. La lógica de cantidades se introduce en `05-reducers`.
- Se usa el índice del array como `key` en el carrito porque puede haber items repetidos. Esto se corrige en `05-reducers` con IDs únicos por entrada.
- El estado del carrito vive en `App` y se pasa hacia abajo como props. Al agregar más páginas en `02-router`, esto se convierte en un problema.

---

## 📁 Estructura relevante

```
src/
├── App.jsx                  ← useState, agregarAlCarrito, layout principal
├── data/
│   └── cookies.js           ← array estático de galletas
└── components/
    ├── CookieCard.jsx        ← recibe cookie + onAgregar como props
    └── Cart.jsx              ← recibe items como prop, calcula el total
```

---

## 🚀 Cómo ejecutar

```bash
cp docker-compose.example.yml docker-compose.yml
docker compose up --build
```

La aplicación estará disponible en `http://localhost:5173`.
