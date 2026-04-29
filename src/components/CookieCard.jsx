import { useNavigate } from "react-router-dom"
import { useCart } from "@/context/CartContext"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Heart } from "lucide-react"

const etiquetaEstilos = {
  Clásica:    "border-stone-200 bg-stone-50 text-stone-600",
  Especial:   "border-amber-200 bg-amber-50 text-amber-700",
  Indulgente: "border-red-200 bg-red-50 text-red-700",
  Fresca:     "border-emerald-200 bg-emerald-50 text-emerald-700",
}

function CookieCard({ cookie }) {
  const navigate = useNavigate()
  const { agregarAlCarrito, toggleFavorito, esFavorito } = useCart()

  const favorito = esFavorito(cookie.id)
  const estiloEtiqueta =
    etiquetaEstilos[cookie.etiqueta] ?? "border-gray-200 bg-gray-50 text-gray-600"

  return (
    <Card className="group flex flex-col hover:-translate-y-1 hover:shadow-md transition-all duration-200">
      <CardContent
        className="flex-1 p-5 cursor-pointer"
        onClick={() => navigate(`/galleta/${cookie.id}`)}
      >
        <div className="relative mb-4">
          <div className="w-16 h-16 rounded-2xl bg-[#FFF1D3] border border-[#FFB090]/40 flex items-center justify-center text-4xl group-hover:scale-105 transition-transform duration-200">
            {cookie.emoji}
          </div>

          {/* Botón de favorito — dispatch TOGGLE_FAVORITE */}
          <button
            onClick={(e) => { e.stopPropagation(); toggleFavorito(cookie.id) }}
            aria-label={favorito ? "Quitar de favoritas" : "Agregar a favoritas"}
            className={`absolute -top-1.5 -right-1.5 w-7 h-7 rounded-full flex items-center justify-center border transition-all duration-200 ${
              favorito
                ? "bg-primary border-primary text-primary-foreground scale-110"
                : "bg-white border-border text-muted-foreground hover:border-primary hover:text-primary"
            }`}
          >
            <Heart className={`h-3.5 w-3.5 ${favorito ? "fill-current" : ""}`} />
          </button>
        </div>

        <h3 className="font-display text-base font-semibold text-foreground leading-tight mb-1">
          {cookie.nombre}
        </h3>
        <p className="text-xs text-muted-foreground leading-relaxed mb-3">
          {cookie.descripcion}
        </p>
        <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${estiloEtiqueta}`}>
          {cookie.etiqueta}
        </span>
      </CardContent>

      <CardFooter className="p-5 pt-0 flex items-center justify-between">
        <span className="font-sans text-lg font-bold text-primary tabular-nums">
          Q{cookie.precio.toFixed(2)}
        </span>
        <Button size="sm" onClick={(e) => { e.stopPropagation(); agregarAlCarrito(cookie) }}>
          <Plus className="h-3.5 w-3.5" />
          Agregar
        </Button>
      </CardFooter>
    </Card>
  )
}

export default CookieCard
