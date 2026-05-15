import CookieCard from "@/components/CookieCard"
import { CartContext } from "@/context/CartContext"

const cookieBase = {
  id: 1,
  nombre: "Choco Chip Clasica",
  descripcion: "La perfecta combinacion de chips de chocolate y masa suave con un toque de vainilla.",
  precio: 18.5,
  etiqueta: "Clasica",
  emoji: "🍪",
}

export default {
  title: "Componentes/CookieCard",
  component: CookieCard,
  parameters: {
    layout: "centered",
  },
}

export const Clasica = {
  args: {
    cookie: cookieBase,
  },
}

export const Especial = {
  args: {
    cookie: {
      id: 2,
      nombre: "Red Velvet Especial",
      descripcion: "Terciopelo rojo con frosting de queso crema y chips de chocolate blanco.",
      precio: 24.0,
      etiqueta: "Especial",
      emoji: "🎂",
    },
  },
}

export const Indulgente = {
  args: {
    cookie: {
      id: 3,
      nombre: "Triple Chocolate",
      descripcion: "Tres tipos de chocolate fundido para los mas golosos del mundo.",
      precio: 28.0,
      etiqueta: "Indulgente",
      emoji: "🍫",
    },
  },
}

export const Fresca = {
  args: {
    cookie: {
      id: 4,
      nombre: "Limon y Chia",
      descripcion: "Fresca y ligera, con semillas de chia, ralladura de limon y poca azucar.",
      precio: 20.0,
      etiqueta: "Fresca",
      emoji: "🍋",
    },
  },
}

// Muestra el estado con favorito activado — sobreescribe el CartContext global
export const ConFavorito = {
  args: {
    cookie: cookieBase,
  },
  decorators: [
    (Story) => (
      <CartContext.Provider
        value={{
          carrito: [],
          favoritos: [cookieBase.id],
          agregarAlCarrito: () => {},
          eliminarDelCarrito: () => {},
          actualizarCantidad: () => {},
          vaciarCarrito: () => {},
          toggleFavorito: () => {},
          esFavorito: (id) => id === cookieBase.id,
        }}
      >
        <Story />
      </CartContext.Provider>
    ),
  ],
}
