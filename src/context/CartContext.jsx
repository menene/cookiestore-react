import { createContext, useContext, useState } from "react"

// 1. Crear el contexto.
//    Esto es simplemente un objeto que React usará para transportar datos
//    a través del árbol de componentes sin pasar props manualmente.
const CartContext = createContext(null)

// 2. El Provider es el componente que envuelve la app y expone el valor
//    del contexto a todos sus descendientes, sin importar qué tan profundo
//    estén en el árbol. Cualquier componente dentro puede leerlo.
export function CartProvider({ children }) {
  const [carrito, setCarrito] = useState([])

  const agregarAlCarrito = (cookie) => {
    setCarrito([...carrito, cookie])
  }

  // El `value` es lo que cualquier componente hijo podrá consumir
  return (
    <CartContext.Provider value={{ carrito, agregarAlCarrito }}>
      {children}
    </CartContext.Provider>
  )
}

// 3. Custom hook para consumir el contexto.
//    En lugar de importar CartContext y llamar useContext(CartContext)
//    en cada componente, exportamos este hook que hace ambas cosas.
//    Uso: const { carrito, agregarAlCarrito } = useCart()
export function useCart() {
  return useContext(CartContext)
}
