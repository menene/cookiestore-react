import { useParams, useNavigate } from "react-router-dom"
import { cookies } from "@/data/cookies"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ShoppingCart } from "lucide-react"

const etiquetaEstilos = {
  Clásica:    "border-stone-200 bg-stone-50 text-stone-600",
  Especial:   "border-amber-200 bg-amber-50 text-amber-700",
  Indulgente: "border-red-200 bg-red-50 text-red-700",
  Fresca:     "border-emerald-200 bg-emerald-50 text-emerald-700",
}

// DetalleCookie recibe agregarAlCarrito como prop desde App.
// Este es el problema: App → <Route element> → DetalleCookie.
// Si DetalleCookie tuviera subcomponentes que también necesitaran
// la función, habría que seguir perforando hacia abajo (prop drilling).
//
// useParams lee el parámetro dinámico :id de la URL actual.
// useNavigate devuelve una función para navegar programáticamente.
function DetalleCookie({ agregarAlCarrito }) {
  const { id } = useParams()
  const navigate = useNavigate()

  // Buscamos la galleta en el array usando el id de la URL
  const cookie = cookies.find((c) => c.id === parseInt(id))

  if (!cookie) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col items-center justify-center py-24 text-center">
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
    // Volvemos al catálogo para que el usuario vea su carrito actualizado
    navigate("/")
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
    <div className="max-w-xl">
      {/* Botón volver — navigate(-1) regresa a la página anterior en el historial */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8 group"
      >
        <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
        Volver al catálogo
      </button>

      {/* Emoji grande */}
      <div className="w-28 h-28 rounded-3xl bg-[#FFF1D3] border border-[#FFB090]/40 flex items-center justify-center text-7xl mb-8 shadow-sm">
        {cookie.emoji}
      </div>

      {/* Etiqueta */}
      <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium mb-4 ${estiloEtiqueta}`}>
        {cookie.etiqueta}
      </span>

      {/* Nombre */}
      <h1 className="font-display text-4xl font-bold text-foreground leading-tight mb-3">
        {cookie.nombre}
      </h1>

      {/* Descripción larga */}
      <p className="text-base text-muted-foreground leading-relaxed mb-8">
        {cookie.descripcion_larga}
      </p>

      {/* Información nutricional */}
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

      {/* Precio y acción */}
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
