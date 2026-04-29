import { useState, useEffect, useRef } from "react"
import { useFetchCookies } from "@/hooks/useFetchCookies"
import { useDebounce } from "@/hooks/useDebounce"
import { useCart } from "@/context/CartContext"
import CookieCard from "@/components/CookieCard"
import { Search, AlertCircle, Heart } from "lucide-react"

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
  const { cookies, loading, error } = useFetchCookies()
  const { favoritos } = useCart()

  const [busqueda, setBusqueda] = useState("")
  const [soloFavoritas, setSoloFavoritas] = useState(false)

  const busquedaDebounced = useDebounce(busqueda, 300)
  const inputRef = useRef(null)

  useEffect(() => {
    if (!loading && inputRef.current) {
      inputRef.current.focus()
    }
  }, [loading])

  const cookiesFiltradas = cookies
    .filter((c) => c.nombre.toLowerCase().includes(busquedaDebounced.toLowerCase()))
    .filter((c) => (soloFavoritas ? favoritos.includes(c.id) : true))

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

      <main className="max-w-7xl mx-auto px-6 py-10">

        {/* Controles: buscador + filtro de favoritas */}
        <div className="flex items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <h2 className="font-display text-2xl font-semibold text-foreground">
              Nuestras Galletas
            </h2>

            {/* Filtro de favoritas */}
            {favoritos.length > 0 && (
              <button
                onClick={() => setSoloFavoritas(!soloFavoritas)}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                  soloFavoritas
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-background text-muted-foreground border-border hover:border-primary hover:text-primary"
                }`}
              >
                <Heart className={`h-3 w-3 ${soloFavoritas ? "fill-current" : ""}`} />
                Favoritas ({favoritos.length})
              </button>
            )}
          </div>

          {/* Buscador con ref para auto-focus */}
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

        {/* Cargando */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {Array.from({ length: 8 }).map((_, i) => <CookieCardSkeleton key={i} />)}
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="flex items-center gap-3 p-4 rounded-xl border border-destructive/30 bg-destructive/5 text-destructive">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        {/* Catálogo — ahora ocupa todo el ancho sin sidebar */}
        {!loading && !error && (
          <>
            {cookiesFiltradas.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <span className="text-5xl mb-3 opacity-40">
                  {soloFavoritas ? "💔" : "🔍"}
                </span>
                <p className="text-sm font-medium text-foreground mb-1">
                  {soloFavoritas
                    ? "No tienes favoritas aún"
                    : `Sin resultados para "${busqueda}"`}
                </p>
                <p className="text-xs text-muted-foreground">
                  {soloFavoritas
                    ? "Marca galletas con el corazón para verlas aquí"
                    : "Intenta con otro nombre"}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-5">
                {cookiesFiltradas.map((cookie) => (
                  <CookieCard key={cookie.id} cookie={cookie} />
                ))}
              </div>
            )}
          </>
        )}

      </main>
    </>
  )
}

export default Catalogo
