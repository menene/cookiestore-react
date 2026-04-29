import { render } from "@testing-library/react"
import { MemoryRouter } from "react-router-dom"
import { CartContext } from "@/context/CartContext"

// Valor de contexto por defecto para tests.
// Cada función es un spy de Vitest — podemos verificar si fue llamada y con qué args.
export const mockCartContext = {
  carrito: [],
  favoritos: [],
  agregarAlCarrito: vi.fn(),
  eliminarDelCarrito: vi.fn(),
  actualizarCantidad: vi.fn(),
  vaciarCarrito: vi.fn(),
  toggleFavorito: vi.fn(),
  esFavorito: vi.fn(() => false),
}

// Wrapper que provee Router + CartContext a cualquier componente que lo necesite.
// Uso: renderWithProviders(<MiComponente />, { cartValue: { ...mockCartContext, carrito: [...] } })
export function renderWithProviders(ui, { cartValue = mockCartContext, route = "/" } = {}) {
  return render(
    <MemoryRouter initialEntries={[route]} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <CartContext.Provider value={cartValue}>{ui}</CartContext.Provider>
    </MemoryRouter>
  )
}
