import Navbar from "@/components/Navbar"
import { CartContext } from "@/context/CartContext"

const baseContext = {
  favoritos: [],
  agregarAlCarrito: () => {},
  eliminarDelCarrito: () => {},
  actualizarCantidad: () => {},
  vaciarCarrito: () => {},
  toggleFavorito: () => {},
  esFavorito: () => false,
}

export default {
  title: "Componentes/Navbar",
  component: Navbar,
  parameters: {
    layout: "fullscreen",
  },
}

// Sin items — el badge no aparece
export const CarritoVacio = {
  decorators: [
    (Story) => (
      <CartContext.Provider value={{ ...baseContext, carrito: [] }}>
        <Story />
      </CartContext.Provider>
    ),
  ],
}

// Pocos items — muestra el numero exacto en el badge
export const ConItems = {
  decorators: [
    (Story) => (
      <CartContext.Provider
        value={{
          ...baseContext,
          carrito: [
            { id: 1, nombre: "Choco Chip", precio: 18.5, cantidad: 2 },
            { id: 2, nombre: "Red Velvet", precio: 24.0, cantidad: 1 },
          ],
        }}
      >
        <Story />
      </CartContext.Provider>
    ),
  ],
}

// Mas de 9 items — el badge muestra "9+" en lugar del numero real
export const BadgeLimitado = {
  decorators: [
    (Story) => (
      <CartContext.Provider
        value={{
          ...baseContext,
          carrito: [
            { id: 1, nombre: "Choco Chip", precio: 18.5, cantidad: 6 },
            { id: 2, nombre: "Red Velvet", precio: 24.0, cantidad: 5 },
          ],
        }}
      >
        <Story />
      </CartContext.Provider>
    ),
  ],
}
