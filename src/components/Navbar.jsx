import { Link } from "react-router-dom"
import { useCart } from "@/context/CartContext"
import { ShoppingBag } from "lucide-react"

function Navbar() {
  const { carrito } = useCart()

  // Sumamos las cantidades de todos los items — ya no es carrito.length
  const totalItems = carrito.reduce((sum, item) => sum + item.cantidad, 0)

  return (
    <header className="sticky top-0 z-10 bg-foreground text-background shadow-md">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <span className="text-2xl">🍪</span>
          <span className="font-display text-lg font-semibold tracking-tight">
            CookieStore
          </span>
        </Link>

        {/* Ícono del carrito con badge — navega a la página dedicada */}
        <Link
          to="/cart"
          className="relative flex items-center gap-2 text-sm text-background/70 hover:text-background transition-colors"
        >
          <div className="relative">
            <ShoppingBag className="h-5 w-5" />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs font-bold w-4 h-4 rounded-full flex items-center justify-center tabular-nums leading-none">
                {totalItems > 9 ? "9+" : totalItems}
              </span>
            )}
          </div>
          <span className="hidden sm:inline">Carrito</span>
        </Link>
      </div>
    </header>
  )
}

export default Navbar
