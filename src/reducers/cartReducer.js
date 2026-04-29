// El reducer vive en su propio archivo por dos razones:
//   1. Separación de responsabilidades — la lógica de negocio separada del contexto
//   2. Testabilidad — una función pura es trivial de testear sin montar ningún componente

export const initialState = {
  carrito: [],   // [{ ...cookie, cantidad: number }]
  favoritos: [], // [id, id, ...]
}

export function cartReducer(state, action) {
  switch (action.type) {
    case "ADD_COOKIE": {
      const existente = state.carrito.find((item) => item.id === action.payload.id)
      if (existente) {
        return {
          ...state,
          carrito: state.carrito.map((item) =>
            item.id === action.payload.id ? { ...item, cantidad: item.cantidad + 1 } : item
          ),
        }
      }
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
