# Rama 02-router — Navegación y el Problema del Estado

Esta rama construye directamente sobre el código de `01-intro`. Se introduce React Router v6 para convertir la tienda en una aplicación de múltiples páginas, y se expone de forma deliberada el problema del **Prop Drilling**.

---

## 🎯 Objetivo de esta rama

Agregar navegación real a CookieStore: una página de catálogo y una página de detalle por galleta. Al hacerlo, el estado del carrito (que vive en `App`) necesita llegar a múltiples componentes de ruta, lo que obliga a perforar props hacia abajo nivel a nivel.

---

## 🧠 Conceptos introducidos

### `<BrowserRouter>`, `<Routes>`, `<Route>`
El sistema de enrutamiento de React Router v6. `BrowserRouter` habilita la navegación en toda la app. `Routes` contiene las rutas y `Route` mapea una URL a un componente.

```jsx
<BrowserRouter>
  <Routes>
    <Route path="/" element={<Catalogo agregarAlCarrito={agregarAlCarrito} />} />
    <Route path="/galleta/:id" element={<DetalleCookie agregarAlCarrito={agregarAlCarrito} />} />
  </Routes>
</BrowserRouter>
```

### `useNavigate`
Hook que devuelve una función para navegar programáticamente, sin necesidad de un `<Link>` en el JSX.

```jsx
const navigate = useNavigate()
navigate(`/galleta/${cookie.id}`)  // navega a la página de detalle
navigate(-1)                        // regresa a la página anterior
```

### `useParams`
Hook que extrae los parámetros dinámicos de la URL actual.

```jsx
// URL: /galleta/3
const { id } = useParams()  // id === "3"
const cookie = cookies.find(c => c.id === parseInt(id))
```

### `<Link>`
Componente de navegación declarativa. Reemplaza al `<a href>` tradicional para evitar recargas del navegador.

```jsx
<Link to="/">Volver al catálogo</Link>
```

---

## 😤 El problema: Prop Drilling

El carrito sigue viviendo en `App`. Para que `Catalogo` y `DetalleCookie` puedan modificarlo, `agregarAlCarrito` debe pasarse como prop a cada componente de ruta:

```
App (dueño del estado)
 └── <Route element={<Catalogo agregarAlCarrito={fn} carrito={arr} />}>
 └── <Route element={<DetalleCookie agregarAlCarrito={fn} />}>
```

Si `DetalleCookie` tuviera componentes hijos que también necesitaran la función, habría que seguir perforando hacia abajo. Eso se vuelve inmanejable rápidamente.

**Este dolor es intencional.** En la rama `03-context` lo resolvemos extrayendo el estado del carrito a un `CartContext` global.

---

## 📁 Estructura relevante

```
src/
├── App.jsx                  ← BrowserRouter, Routes, prop drilling
├── pages/
│   ├── Catalogo.jsx         ← página principal, recibe carrito + agregarAlCarrito
│   └── DetalleCookie.jsx    ← useParams, useNavigate, recibe agregarAlCarrito
└── components/
    ├── Navbar.jsx            ← Link de navegación
    └── CookieCard.jsx        ← useNavigate para ir al detalle
```

---

## 🚀 Cómo ejecutar

Copia el archivo de ejemplo y levanta el contenedor:

```bash
cp docker-compose.example.yml docker-compose.yml
docker compose up --build
```

La aplicación estará disponible en `http://localhost:5173`.
