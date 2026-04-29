import { createContext, useContext, useReducer, useEffect } from "react"
import { cartReducer, initialState } from "@/reducers/cartReducer"

// Exportamos CartContext para poder mockearlo en los tests
export const CartContext = createContext(null)

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, null, () => {
    try {
      const saved = localStorage.getItem("cookiestore-state")
      return saved ? JSON.parse(saved) : initialState
    } catch {
      return initialState
    }
  })

  useEffect(() => {
    localStorage.setItem("cookiestore-state", JSON.stringify(state))
  }, [state])

  const agregarAlCarrito   = (cookie) => dispatch({ type: "ADD_COOKIE",       payload: cookie })
  const eliminarDelCarrito = (id)     => dispatch({ type: "REMOVE_COOKIE",    payload: id })
  const actualizarCantidad = (id, cantidad) => dispatch({ type: "UPDATE_QUANTITY", payload: { id, cantidad } })
  const vaciarCarrito      = ()       => dispatch({ type: "CLEAR_CART" })
  const toggleFavorito     = (id)     => dispatch({ type: "TOGGLE_FAVORITE",  payload: id })
  const esFavorito         = (id)     => state.favoritos.includes(id)

  return (
    <CartContext.Provider
      value={{
        carrito: state.carrito,
        favoritos: state.favoritos,
        agregarAlCarrito,
        eliminarDelCarrito,
        actualizarCantidad,
        vaciarCarrito,
        toggleFavorito,
        esFavorito,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  return useContext(CartContext)
}
