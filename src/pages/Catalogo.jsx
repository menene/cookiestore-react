import { cookies } from "@/data/cookies"
import CookieCard from "@/components/CookieCard"
import Cart from "@/components/Cart"

// Catalogo ya no recibe ninguna prop relacionada al carrito.
// Cada componente hijo (CookieCard, Cart) accede al contexto directamente.
// El Prop Drilling desapareció.
function Catalogo() {
  return (
    <>
      {/* Hero */}
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
              // CookieCard ya no necesita recibir onAgregar como prop
              <CookieCard key={cookie.id} cookie={cookie} />
            ))}
          </div>
        </section>

        {/* Cart ya no necesita recibir items como prop */}
        <Cart />
      </main>
    </>
  )
}

export default Catalogo
