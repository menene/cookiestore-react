import { cookies } from "@/data/cookies"
import CookieCard from "@/components/CookieCard"
import Cart from "@/components/Cart"

// Catalogo recibe dos props desde App:
//   carrito          → el array completo, para pasárselo al Cart
//   agregarAlCarrito → la función para modificar el carrito, para pasársela a CookieCard
//
// Nota: si CookieCard tuviera hijos que también necesitaran agregarAlCarrito,
// habría que seguir perforando hacia abajo. Eso es exactamente el Prop Drilling
// que resolveremos en la rama 03-context.
function Catalogo({ carrito, agregarAlCarrito }) {
  return (
    <>
      {/* Hero — mismo diseño que en la rama 01-intro */}
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

      {/* Catálogo + Carrito */}
      <main className="max-w-7xl mx-auto px-6 py-10 flex items-start gap-8">

        <section className="flex-1 min-w-0">
          <h2 className="font-display text-2xl font-semibold text-foreground mb-6">
            Nuestras Galletas
          </h2>

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

        {/* Cart también recibe sus datos por prop drilling */}
        <Cart items={carrito} />

      </main>
    </>
  )
}

export default Catalogo
