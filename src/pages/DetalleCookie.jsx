import { useParams, useNavigate } from "react-router-dom"
import { useCart } from "@/context/CartContext"
import { useFetchCookies } from "@/hooks/useFetchCookies"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ShoppingCart } from "lucide-react"

const etiquetaEstilos = {
  Clásica:    "border-stone-200 bg-stone-50 text-stone-600",
  Especial:   "border-amber-200 bg-amber-50 text-amber-700",
  Indulgente: "border-red-200 bg-red-50 text-red-700",
  Fresca:     "border-emerald-200 bg-emerald-50 text-emerald-700",
}

// useFetchCookies es reutilizable — no solo funciona en el catálogo.
// Aquí lo usamos para obtener los datos de la galleta específica por ID.
function DetalleCookie() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { agregarAlCarrito } = useCart()
  const { cookies, loading } = useFetchCookies()

  // Mientras cargan los datos mostramos un skeleton
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="max-w-xl animate-pulse space-y-4">
          <div className="h-4 bg-muted rounded w-32" />
          <div className="w-28 h-28 rounded-3xl bg-muted" />
          <div className="h-3 bg-muted rounded w-20" />
          <div className="h-8 bg-muted rounded w-64" />
          <div className="h-3 bg-muted rounded w-full" />
          <div className="h-3 bg-muted rounded w-5/6" />
        </div>
      </div>
    )
  }

  const cookie = cookies.find((c) => c.id === parseInt(id))

  if (!cookie) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col items-center justify-center text-center">
        <span className="text-6xl mb-4">🤔</span>
        <h2 className="font-display text-2xl font-semibold text-foreground mb-2">
          Galleta no encontrada
        </h2>
        <p className="text-sm text-muted-foreground mb-6">
          No existe ninguna galleta con ese ID.
        </p>
        <Button variant="outline" onClick={() => navigate("/")}>
          <ArrowLeft className="h-4 w-4" />
          Volver al catálogo
        </Button>
      </div>
    )
  }

  const estiloEtiqueta =
    etiquetaEstilos[cookie.etiqueta] ?? "border-gray-200 bg-gray-50 text-gray-600"

  const handleAgregar = () => {
    agregarAlCarrito(cookie)
    navigate("/")
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <div className="max-w-xl">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8 group"
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
          Volver al catálogo
        </button>

        <div className="w-28 h-28 rounded-3xl bg-[#FFF1D3] border border-[#FFB090]/40 flex items-center justify-center text-7xl mb-8 shadow-sm">
          {cookie.emoji}
        </div>

        <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium mb-4 ${estiloEtiqueta}`}>
          {cookie.etiqueta}
        </span>

        <h1 className="font-display text-4xl font-bold text-foreground leading-tight mb-3">
          {cookie.nombre}
        </h1>

        <p className="text-base text-muted-foreground leading-relaxed mb-8">
          {cookie.descripcion_larga}
        </p>

        <div className="flex items-center gap-6 mb-8 p-4 rounded-xl bg-[#FFF1D3]/60 border border-[#FFB090]/30">
          <div className="text-center">
            <p className="font-sans text-xl font-bold text-foreground tabular-nums">{cookie.calorias}</p>
            <p className="text-xs text-muted-foreground mt-0.5">kcal</p>
          </div>
          <div className="w-px h-8 bg-border" />
          <div className="text-center">
            <p className="font-sans text-xl font-bold text-foreground tabular-nums">{cookie.peso_g}g</p>
            <p className="text-xs text-muted-foreground mt-0.5">peso</p>
          </div>
          <div className="w-px h-8 bg-border" />
          <div className="flex-1">
            <p className="text-xs text-muted-foreground mb-1.5">Ingredientes</p>
            <p className="text-xs text-foreground leading-relaxed">
              {cookie.ingredientes.join(", ")}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <span className="font-sans text-3xl font-bold text-primary tabular-nums">
            Q{cookie.precio.toFixed(2)}
          </span>
          <Button size="lg" onClick={handleAgregar}>
            <ShoppingCart className="h-4 w-4" />
            Agregar al carrito
          </Button>
        </div>
      </div>
    </div>
  )
}

export default DetalleCookie
