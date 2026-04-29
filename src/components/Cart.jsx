import { ShoppingBag } from "lucide-react"

// Cart recibe `items` como prop: el array del carrito definido en App.
// En esta rama solo muestra los items y el total — no hay "eliminar" todavía.
// Esa lógica compleja llega en la rama 05-reducers.
function Cart({ items }) {
  // Calculamos el total sumando el precio de cada item en el array
  const total = items.reduce((suma, item) => suma + item.precio, 0)

  return (
    <aside className="w-80 shrink-0">
      <div className="sticky top-6 rounded-2xl border border-border bg-white overflow-hidden shadow-sm">

        {/* Encabezado */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border bg-[#FFF1D3]/60">
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-4 w-4 text-primary" />
            <h2 className="font-display text-sm font-semibold text-foreground">
              Tu Carrito
            </h2>
          </div>
          {items.length > 0 && (
            <span className="bg-primary text-primary-foreground text-xs font-bold px-2 py-0.5 rounded-full tabular-nums">
              {items.length}
            </span>
          )}
        </div>

        {items.length === 0 ? (
          /* Estado vacío */
          <div className="flex flex-col items-center justify-center py-12 px-5 text-center">
            <div className="text-5xl mb-3 opacity-40">🛒</div>
            <p className="text-sm font-medium text-foreground mb-1">
              El carrito está vacío
            </p>
            <p className="text-xs text-muted-foreground">
              Agrega algunas galletas para comenzar
            </p>
          </div>
        ) : (
          <>
            {/* Lista de items — cada entrada es una galleta del array */}
            <ul className="divide-y divide-border max-h-72 overflow-y-auto">
              {items.map((item, index) => (
                // Usamos el índice como key porque el array puede tener duplicados.
                // En la rama 05-reducers manejaremos esto correctamente con IDs únicos.
                <li key={index} className="flex items-center gap-3 px-5 py-3">
                  <span className="text-xl leading-none">{item.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-foreground truncate">
                      {item.nombre}
                    </p>
                  </div>
                  <span className="font-sans text-xs font-bold text-primary shrink-0 tabular-nums">
                    Q{item.precio.toFixed(2)}
                  </span>
                </li>
              ))}
            </ul>

            {/* Total */}
            <div className="px-5 py-4 border-t border-border bg-[#FFF1D3]/40">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground uppercase tracking-wide font-medium">
                  Total
                </span>
                <span className="font-sans text-xl font-bold text-foreground tabular-nums">
                  Q{total.toFixed(2)}
                </span>
              </div>
            </div>
          </>
        )}
      </div>
    </aside>
  )
}

export default Cart
