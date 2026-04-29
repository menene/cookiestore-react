# Rama 06-forms — El Checkout y Validación

Esta rama construye directamente sobre el código de `05-reducers`. Se construye la página de checkout con un formulario complejo de envío y pago, introduciendo React Hook Form y Zod para manejar la validación de forma eficiente.

---

## 🎯 Objetivo de esta rama

Demostrar el problema de manejar formularios grandes con `useState` y resolverlo con React Hook Form. El punto clave: con `useState` el componente se re-renderiza en cada tecla; con React Hook Form, los inputs son **no controlados** por defecto y no generan re-renders mientras el usuario escribe.

---

## 🧠 Conceptos introducidos

### Componentes controlados vs no controlados

**Controlado** (`useState`) — React controla el valor del input en cada cambio:
```jsx
const [nombre, setNombre] = useState("")
<input value={nombre} onChange={e => setNombre(e.target.value)} />
// Re-render en cada tecla ↑
```

**No controlado** (React Hook Form) — el DOM controla el valor, React solo lo lee al validar:
```jsx
<input {...register("nombre")} />
// Sin re-renders mientras escribe ↑
```

### `useForm` + `zodResolver`
Inicializa el formulario conectando el esquema de Zod como validador.

```jsx
const { register, handleSubmit, formState: { errors } } = useForm({
  resolver: zodResolver(checkoutSchema),
})
```

### `register`
Conecta un input al formulario. Devuelve las props necesarias (`name`, `ref`, `onChange`, `onBlur`).

```jsx
<input {...register("nombre")} />
```

### `handleSubmit`
Envuelve el handler del formulario. Valida con Zod antes de ejecutarlo — si hay errores, el handler no se llama.

```jsx
<form onSubmit={handleSubmit(onSubmit)}>
```

### `formState.errors`
Objeto con los errores de validación de cada campo. El mensaje viene del esquema Zod.

```jsx
{errors.nombre && <p>{errors.nombre.message}</p>}
```

### Esquema Zod
Define la forma y las reglas del formulario como un objeto tipado y reutilizable.

```js
const checkoutSchema = z.object({
  nombre:       z.string().min(2, "Al menos 2 caracteres"),
  telefono:     z.string().regex(/^\d{8}$/, "Debe tener 8 dígitos"),
  numeroTarjeta: z.string().regex(/^\d{16}$/, "16 dígitos sin espacios"),
  vencimiento:  z.string().regex(/^(0[1-9]|1[0-2])\/\d{2}$/, "Formato MM/AA"),
  cvv:          z.string().regex(/^\d{3,4}$/, "3 o 4 dígitos"),
  // ...
})
```

---

## ✨ Novedades en la UI

- **Página `/checkout`** — dos secciones (envío y pago) + resumen del pedido
- **Validación por campo** — el error aparece al salir del input o al intentar enviar
- **Pantalla de confirmación** — tras el submit exitoso, vacía el carrito y muestra confirmación
- **Botón "Ir al checkout"** en `/cart`

---

## 📦 Nuevas dependencias

```bash
react-hook-form
zod
@hookform/resolvers
```

---

## 📁 Estructura relevante

```
src/
├── pages/
│   ├── CheckoutPage.jsx   ← useForm, zodResolver, register, handleSubmit, errors
│   └── CartPage.jsx       ← botón a /checkout
└── App.jsx                ← ruta /checkout
```

---

## 🚀 Cómo ejecutar

```bash
cp .env.example .env
cp docker-compose.example.yml docker-compose.yml
docker compose up --build
```

La aplicación estará disponible en `http://localhost:5173`.
