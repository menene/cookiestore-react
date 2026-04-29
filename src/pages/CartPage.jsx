import { Link } from "react-router-dom"
import { useCart } from "@/context/CartContext"
import { Button } from "@/components/ui/button"
import { Minus, Plus, Trash2, ArrowLeft, ShoppingBag } from "lucide-react"

function CartPage() {
  const { carrito, eliminarDelCarrito, actualizarCantidad, vaciarCarrito } = useCart()

  const totalItems = carrito.reduce((sum, item) => sum + item.cantidad, 0)
  const total = carrito.reduce((sum, item) => sum + item.precio * item.cantidad, 0)

  // Estado vacío
  if (carrito.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-20 h-20 rounded-full bg-[#FFF1D3] flex items-center justify-center mb-6">
            <ShoppingBag className="h-9 w-9 text-primary" />
          </div>
          <h1 className="font-display text-3xl font-bold text-foreground mb-2">
            Tu carrito está vacío
          </h1>
          <p className="text-sm text-muted-foreground mb-8">
            Agrega algunas galletas para comenzar
          </p>
          <Button asChild>
            <Link to="/">
              <ArrowLeft className="h-4 w-4" />
              Ver catálogo
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">

      {/* Encabezado */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <Link
            to="/"
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-3 group"
          >
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
            Seguir comprando
          </Link>
          <h1 className="font-display text-4xl font-bold text-foreground leading-tight">
            Tu Carrito
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {totalItems} {totalItems === 1 ? "galleta" : "galletas"}
          </p>
        </div>

        {/* dispatch({ type: "CLEAR_CART" }) — via vaciarCarrito() */}
        <Button
          variant="outline"
          size="sm"
          onClick={vaciarCarrito}
          className="text-destructive border-destructive/30 hover:bg-destructive/5 hover:text-destructive"
        >
          <Trash2 className="h-3.5 w-3.5" />
          Vaciar carrito
        </Button>
      </div>

      {/* Lista de items */}
      <div className="rounded-2xl border border-border bg-white overflow-hidden shadow-sm mb-6">
        <ul className="divide-y divide-border">
          {carrito.map((item) => (
            <li key={item.id} className="flex items-center gap-4 px-6 py-4">

              {/* Emoji */}
              <div className="w-12 h-12 rounded-xl bg-[#FFF1D3] border border-[#FFB090]/40 flex items-center justify-center text-2xl shrink-0">
                {item.emoji}
              </div>

              {/* Nombre y etiqueta */}
              <div className="flex-1 min-w-0">
                <p className="font-display font-semibold text-foreground text-sm leading-tight truncate">
                  {item.nombre}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">{item.etiqueta}</p>
              </div>

              {/* Controles de cantidad — dispatch UPDATE_QUANTITY */}
              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() => actualizarCantidad(item.id, item.cantidad - 1)}
                  className="w-7 h-7 rounded-lg border border-border flex items-center justify-center hover:bg-muted transition-colors"
                >
                  <Minus className="h-3 w-3" />
                </button>
                <span className="w-8 text-center font-sans text-sm font-bold tabular-nums">
                  {item.cantidad}
                </span>
                <button
                  onClick={() => actualizarCantidad(item.id, item.cantidad + 1)}
                  className="w-7 h-7 rounded-lg border border-border flex items-center justify-center hover:bg-muted transition-colors"
                >
                  <Plus className="h-3 w-3" />
                </button>
              </div>

              {/* Subtotal del item */}
              <span className="font-sans text-sm font-bold text-primary tabular-nums w-16 text-right shrink-0">
                Q{(item.precio * item.cantidad).toFixed(2)}
              </span>

              {/* Eliminar — dispatch REMOVE_COOKIE */}
              <button
                onClick={() => eliminarDelCarrito(item.id)}
                className="text-muted-foreground hover:text-destructive transition-colors shrink-0 ml-1"
              >
                <Trash2 className="h-4 w-4" />
              </button>

            </li>
          ))}
        </ul>

        {/* Total */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#FFF1D3]/40 border-t border-border">
          <span className="text-xs text-muted-foreground uppercase tracking-wide font-medium">
            Total
          </span>
          <span className="font-sans text-2xl font-bold text-foreground tabular-nums">
            Q{total.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Ir al checkout */}
      <Button asChild size="lg" className="w-full">
        <Link to="/checkout">
          Ir al checkout — Q{total.toFixed(2)}
        </Link>
      </Button>

    </div>
  )
}

export default CartPage
