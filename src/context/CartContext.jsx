import { createContext, useContext, useReducer, useEffect } from "react"

const CartContext = createContext(null)

// El estado ahora tiene dos secciones:
//   carrito   → items con cantidad, no duplicados
//   favoritos → array de IDs de galletas marcadas como favoritas
const initialState = {
  carrito: [],   // [{ ...cookie, cantidad: number }]
  favoritos: [], // [id, id, ...]
}

// El reducer es una función PURA: dado un estado y una acción, devuelve un nuevo estado.
// Nunca muta el estado directamente — siempre retorna un objeto nuevo.
// Todas las acciones están centralizadas aquí, no dispersas en múltiples funciones.
function cartReducer(state, action) {
  switch (action.type) {

    case "ADD_COOKIE": {
      const existente = state.carrito.find((item) => item.id === action.payload.id)
      if (existente) {
        // La galleta ya existe — incrementamos su cantidad
        return {
          ...state,
          carrito: state.carrito.map((item) =>
            item.id === action.payload.id
              ? { ...item, cantidad: item.cantidad + 1 }
              : item
          ),
        }
      }
      // Primera vez — la agregamos con cantidad 1
      return {
        ...state,
        carrito: [...state.carrito, { ...action.payload, cantidad: 1 }],
      }
    }

    case "REMOVE_COOKIE":
      return {
        ...state,
        carrito: state.carrito.filter((item) => item.id !== action.payload),
      }

    case "UPDATE_QUANTITY": {
      const { id, cantidad } = action.payload
      // Si la cantidad llega a 0, eliminamos el item directamente
      if (cantidad <= 0) {
        return { ...state, carrito: state.carrito.filter((item) => item.id !== id) }
      }
      return {
        ...state,
        carrito: state.carrito.map((item) =>
          item.id === id ? { ...item, cantidad } : item
        ),
      }
    }

    case "CLEAR_CART":
      return { ...state, carrito: [] }

    case "TOGGLE_FAVORITE": {
      const id = action.payload
      const esFav = state.favoritos.includes(id)
      return {
        ...state,
        favoritos: esFav
          ? state.favoritos.filter((fid) => fid !== id)
          : [...state.favoritos, id],
      }
    }

    default:
      return state
  }
}

export function CartProvider({ children }) {
  // Inicialización lazy: intentamos leer el estado guardado en localStorage.
  // Si no existe, usamos initialState.
  const [state, dispatch] = useReducer(cartReducer, null, () => {
    try {
      const saved = localStorage.getItem("cookiestore-state")
      return saved ? JSON.parse(saved) : initialState
    } catch {
      return initialState
    }
  })

  // Persistimos el estado completo cada vez que cambia
  useEffect(() => {
    localStorage.setItem("cookiestore-state", JSON.stringify(state))
  }, [state])

  // Funciones semánticas que envuelven dispatch.
  // Los componentes nunca llaman dispatch directamente —
  // usan estas funciones con nombres claros.
  const agregarAlCarrito   = (cookie) => dispatch({ type: "ADD_COOKIE",       payload: cookie })
  const eliminarDelCarrito = (id)     => dispatch({ type: "REMOVE_COOKIE",    payload: id })
  const actualizarCantidad = (id, cantidad) => dispatch({ type: "UPDATE_QUANTITY", payload: { id, cantidad } })
  const vaciarCarrito      = ()       => dispatch({ type: "CLEAR_CART" })
  const toggleFavorito     = (id)     => dispatch({ type: "TOGGLE_FAVORITE",  payload: id })
  const esFavorito         = (id)     => state.favoritos.includes(id)

  return (
    <CartContext.Provider value={{
      carrito: state.carrito,
      favoritos: state.favoritos,
      agregarAlCarrito,
      eliminarDelCarrito,
      actualizarCantidad,
      vaciarCarrito,
      toggleFavorito,
      esFavorito,
    }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  return useContext(CartContext)
}
