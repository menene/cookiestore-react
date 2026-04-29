import { useState, useEffect, useRef } from "react"
import { useFetchCookies } from "@/hooks/useFetchCookies"
import { useDebounce } from "@/hooks/useDebounce"
import CookieCard from "@/components/CookieCard"
import Cart from "@/components/Cart"
import { Search, AlertCircle } from "lucide-react"

// Skeleton de una tarjeta — se muestra mientras cargan los datos reales
function CookieCardSkeleton() {
  return (
    <div className="rounded-xl border bg-card p-5 animate-pulse">
      <div className="w-16 h-16 rounded-2xl bg-muted mb-4" />
      <div className="h-4 bg-muted rounded w-3/4 mb-2" />
      <div className="h-3 bg-muted rounded w-full mb-1" />
      <div className="h-3 bg-muted rounded w-2/3 mb-4" />
      <div className="h-5 bg-muted rounded w-16" />
    </div>
  )
}

function Catalogo() {
  // useFetchCookies encapsula el fetch, el loading y el error.
  // Internamente usa useEffect para hacer la petición al montar.
  const { cookies, loading, error } = useFetchCookies()

  // Estado del buscador — se actualiza en cada tecla
  const [busqueda, setBusqueda] = useState("")

  // useDebounce retrasa el valor 300ms después de que el usuario deja de escribir.
  // El filtrado solo corre cuando el usuario hace una pausa — no en cada tecla.
  const busquedaDebounced = useDebounce(busqueda, 300)

  // useRef crea una referencia mutable al nodo del DOM del input.
  // Cambiar ref.current NO provoca un re-render — a diferencia de useState.
  const inputRef = useRef(null)

  // Al terminar la carga, enfocamos el buscador automáticamente.
  useEffect(() => {
    if (!loading && inputRef.current) {
      inputRef.current.focus()
    }
  }, [loading])

  // Filtrado client-side usando el valor debounced, no el valor inmediato.
  const cookiesFiltradas = cookies.filter((c) =>
    c.nombre.toLowerCase().includes(busquedaDebounced.toLowerCase())
  )

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

          {/* Encabezado con buscador */}
          <div className="flex items-center justify-between gap-4 mb-6">
            <h2 className="font-display text-2xl font-semibold text-foreground shrink-0">
              Nuestras Galletas
            </h2>

            {/* Input con ref — se enfocará automáticamente cuando los datos carguen */}
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <input
                ref={inputRef}
                type="text"
                placeholder="Buscar galletas..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-shadow"
              />
            </div>
          </div>

          {/* Estado de carga — skeletons mientras llegan los datos */}
          {loading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {Array.from({ length: 8 }).map((_, i) => (
                <CookieCardSkeleton key={i} />
              ))}
            </div>
          )}

          {/* Estado de error */}
          {error && (
            <div className="flex items-center gap-3 p-4 rounded-xl border border-destructive/30 bg-destructive/5 text-destructive">
              <AlertCircle className="h-5 w-5 shrink-0" />
              <p className="text-sm font-medium">{error}</p>
            </div>
          )}

          {/* Catálogo cargado */}
          {!loading && !error && (
            <>
              {cookiesFiltradas.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <span className="text-5xl mb-3 opacity-40">🔍</span>
                  <p className="text-sm font-medium text-foreground mb-1">
                    Sin resultados para "{busqueda}"
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Intenta con otro nombre
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                  {cookiesFiltradas.map((cookie) => (
                    <CookieCard key={cookie.id} cookie={cookie} />
                  ))}
                </div>
              )}
            </>
          )}

        </section>

        <Cart />
      </main>
    </>
  )
}

export default Catalogo
