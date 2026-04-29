import { useNavigate } from "react-router-dom"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

// Colores por categoría — feedback visual para el usuario
const etiquetaEstilos = {
  Clásica:    "border-stone-200 bg-stone-50 text-stone-600",
  Especial:   "border-amber-200 bg-amber-50 text-amber-700",
  Indulgente: "border-red-200 bg-red-50 text-red-700",
  Fresca:     "border-emerald-200 bg-emerald-50 text-emerald-700",
}

// CookieCard recibe dos props:
//   cookie    → objeto con los datos de la galleta (nombre, precio, emoji, etc.)
//   onAgregar → función definida en App que actualiza el estado del carrito
//
// useNavigate: hook de React Router que devuelve una función para navegar
// programáticamente, sin necesidad de un <Link> en el JSX.
function CookieCard({ cookie, onAgregar }) {
  const navigate = useNavigate()
  const estiloEtiqueta =
    etiquetaEstilos[cookie.etiqueta] ?? "border-gray-200 bg-gray-50 text-gray-600"

  return (
    <Card className="group flex flex-col hover:-translate-y-1 hover:shadow-md transition-all duration-200">
      {/* El área superior es clickeable y navega al detalle de la galleta */}
      <CardContent
        className="flex-1 p-5 cursor-pointer"
        onClick={() => navigate(`/galleta/${cookie.id}`)}
      >
        {/* Emoji con fondo cálido — escala suavemente al hacer hover */}
        <div className="w-16 h-16 rounded-2xl bg-[#FFF1D3] border border-[#FFB090]/40 flex items-center justify-center text-4xl mb-4 group-hover:scale-105 transition-transform duration-200">
          {cookie.emoji}
        </div>

        {/* Nombre */}
        <h3 className="font-display text-base font-semibold text-foreground leading-tight mb-1">
          {cookie.nombre}
        </h3>

        {/* Descripción */}
        <p className="text-xs text-muted-foreground leading-relaxed mb-3">
          {cookie.descripcion}
        </p>

        {/* Etiqueta de categoría */}
        <span
          className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${estiloEtiqueta}`}
        >
          {cookie.etiqueta}
        </span>
      </CardContent>

      <CardFooter className="p-5 pt-0 flex items-center justify-between">
        {/* Precio */}
        <span className="font-sans text-lg font-bold text-primary tabular-nums">
          Q{cookie.precio.toFixed(2)}
        </span>

        {/* Agregar directo al carrito sin cambiar de página */}
        <Button size="sm" onClick={(e) => { e.stopPropagation(); onAgregar(cookie) }}>
          <Plus className="h-3.5 w-3.5" />
          Agregar
        </Button>
      </CardFooter>
    </Card>
  )
}

export default CookieCard
