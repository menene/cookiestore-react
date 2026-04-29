import { Link } from "react-router-dom"

// Navbar usa <Link> de React Router para navegar sin recargar la página.
// Recibe cartCount como prop para mostrar cuántas galletas hay en el carrito.
// El carrito sigue viviendo en App — por eso tenemos que pasar este dato hacia abajo.
function Navbar({ cartCount }) {
  return (
    <header className="sticky top-0 z-10 bg-foreground text-background shadow-md">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Link navega a la raíz sin recargar el navegador */}
        <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <span className="text-2xl">🍪</span>
          <span className="font-display text-lg font-semibold tracking-tight">
            CookieStore
          </span>
        </Link>

        <span className="text-sm text-background/60">
          {cartCount === 0
            ? "Carrito vacío"
            : `${cartCount} ${cartCount === 1 ? "galleta" : "galletas"} en el carrito`}
        </span>
      </div>
    </header>
  )
}

export default Navbar
