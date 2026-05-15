import "../src/index.css"
import { MemoryRouter } from "react-router-dom"
import { CartContext } from "../src/context/CartContext"

// Contexto por defecto para todas las stories.
// Los componentes que necesiten un estado distinto pueden sobreescribirlo
// con un decorator a nivel de story o de archivo.
const mockCartContext = {
  carrito: [],
  favoritos: [],
  agregarAlCarrito: () => {},
  eliminarDelCarrito: () => {},
  actualizarCantidad: () => {},
  vaciarCarrito: () => {},
  toggleFavorito: () => {},
  esFavorito: () => false,
}

/** @type { import('@storybook/react').Preview } */
const preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  decorators: [
    (Story) => (
      <MemoryRouter>
        <CartContext.Provider value={mockCartContext}>
          <Story />
        </CartContext.Provider>
      </MemoryRouter>
    ),
  ],
}

export default preview
