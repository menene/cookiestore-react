import { useState } from "react"
import { cookies } from "@/data/cookies"
import CookieCard from "@/components/CookieCard"
import Cart from "@/components/Cart"

// App es el componente raíz. En esta rama, todo vive aquí:
//   - el estado del carrito (useState)
//   - el catálogo de galletas (importado como array estático)
//   - la función para agregar al carrito (pasada como prop)
function App() {
  // useState devuelve el valor actual y una función para actualizarlo.
  // El carrito es un array simple: cada galleta agregada es un nuevo elemento.
  // Nota: en esta rama los duplicados son intencionales — la lógica de
  // cantidades y eliminación se introduce en la rama 05-reducers.
  const [carrito, setCarrito] = useState([])

  // Crea un nuevo array con la galleta añadida al final.
  // Nunca mutamos el array directamente — React necesita un nuevo objeto
  // para detectar el cambio y volver a renderizar.
  const agregarAlCarrito = (cookie) => {
    setCarrito([...carrito, cookie])
  }

  return (
    <div className="min-h-screen bg-background">

      {/* ── Header ──────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-10 bg-foreground text-background shadow-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🍪</span>
            <span className="font-display text-lg font-semibold tracking-tight">
              CookieStore
            </span>
          </div>
          <span className="text-sm text-background/60">
            {carrito.length === 0
              ? "Carrito vacío"
              : `${carrito.length} ${carrito.length === 1 ? "galleta" : "galletas"} en el carrito`}
          </span>
        </div>
      </header>

      {/* ── Hero ────────────────────────────────────────────────────── */}
      <div className="bg-foreground text-background pt-10 pb-12">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-xs uppercase tracking-widest text-background/40 font-medium mb-3">
            Horneadas a diario · Guatemala City
          </p>
          <h1 className="font-display text-5xl md:text-6xl font-bold leading-tight">
            Galletas artesanales<br />
            <em className="text-primary not-italic">para cada momento.</em>
          </h1>
        </div>
      </div>

      {/* ── Catálogo + Carrito ──────────────────────────────────────── */}
      <main className="max-w-7xl mx-auto px-6 py-10 flex items-start gap-8">

        {/* Catálogo ─────────────────────────────────────────────────── */}
        <section className="flex-1 min-w-0">
          <h2 className="font-display text-2xl font-semibold text-foreground mb-6">
            Nuestras Galletas
          </h2>

          {/* .map() transforma cada objeto del array en un componente CookieCard.
              Le pasamos dos props:
                · cookie     → los datos de la galleta
                · onAgregar  → la función para actualizar el carrito              */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {cookies.map((cookie) => (
              <CookieCard
                key={cookie.id}
                cookie={cookie}
                onAgregar={agregarAlCarrito}
              />
            ))}
          </div>
        </section>

        {/* Carrito ──────────────────────────────────────────────────── */}
        {/* El carrito recibe el array como prop — solo lee, no modifica */}
        <Cart items={carrito} />
      </main>

    </div>
  )
}

export default App
