import { createContext, useContext } from "react"
import { useLocalStorage } from "@/hooks/useLocalStorage"

const CartContext = createContext(null)

export function CartProvider({ children }) {
  // useLocalStorage reemplaza a useState — misma API, pero el carrito
  // sobrevive recargas de página porque se persiste en localStorage.
  const [carrito, setCarrito] = useLocalStorage("cookiestore-carrito", [])

  const agregarAlCarrito = (cookie) => {
    setCarrito([...carrito, cookie])
  }

  return (
    <CartContext.Provider value={{ carrito, agregarAlCarrito }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  return useContext(CartContext)
}
