import { describe, it, expect } from "vitest"
import { cartReducer, initialState } from "@/reducers/cartReducer"

// Los reducers son funciones puras — el tipo de código más fácil de testear.
// No necesitan montar ningún componente ni mockear nada.
// Dado un estado y una acción, siempre devuelven el mismo resultado.

const mockCookie = {
  id: 1,
  nombre: "Chocolate Chip Clásica",
  precio: 2.5,
  emoji: "🍪",
  etiqueta: "Clásica",
}

const mockCookie2 = {
  id: 2,
  nombre: "Red Velvet",
  precio: 3.25,
  emoji: "❤️",
  etiqueta: "Especial",
}

describe("cartReducer", () => {

  describe("ADD_COOKIE", () => {
    it("agrega una galleta nueva con cantidad 1", () => {
      const state = cartReducer(initialState, { type: "ADD_COOKIE", payload: mockCookie })
      expect(state.carrito).toHaveLength(1)
      expect(state.carrito[0].cantidad).toBe(1)
      expect(state.carrito[0].id).toBe(1)
    })

    it("incrementa la cantidad si la galleta ya existe en el carrito", () => {
      const conUna = cartReducer(initialState, { type: "ADD_COOKIE", payload: mockCookie })
      const conDos = cartReducer(conUna, { type: "ADD_COOKIE", payload: mockCookie })
      expect(conDos.carrito).toHaveLength(1)
      expect(conDos.carrito[0].cantidad).toBe(2)
    })

    it("agrega galletas distintas como items separados", () => {
      const conUna = cartReducer(initialState, { type: "ADD_COOKIE", payload: mockCookie })
      const conDos = cartReducer(conUna, { type: "ADD_COOKIE", payload: mockCookie2 })
      expect(conDos.carrito).toHaveLength(2)
    })

    it("no muta el estado original", () => {
      const original = { ...initialState }
      cartReducer(initialState, { type: "ADD_COOKIE", payload: mockCookie })
      expect(initialState.carrito).toHaveLength(0)
      expect(initialState).toEqual(original)
    })
  })

  describe("REMOVE_COOKIE", () => {
    it("elimina un item del carrito por id", () => {
      const conItem = cartReducer(initialState, { type: "ADD_COOKIE", payload: mockCookie })
      const sinItem = cartReducer(conItem, { type: "REMOVE_COOKIE", payload: 1 })
      expect(sinItem.carrito).toHaveLength(0)
    })

    it("no afecta otros items al eliminar uno", () => {
      let state = cartReducer(initialState, { type: "ADD_COOKIE", payload: mockCookie })
      state = cartReducer(state, { type: "ADD_COOKIE", payload: mockCookie2 })
      state = cartReducer(state, { type: "REMOVE_COOKIE", payload: 1 })
      expect(state.carrito).toHaveLength(1)
      expect(state.carrito[0].id).toBe(2)
    })

    it("no hace nada si el id no existe", () => {
      const conItem = cartReducer(initialState, { type: "ADD_COOKIE", payload: mockCookie })
      const resultado = cartReducer(conItem, { type: "REMOVE_COOKIE", payload: 999 })
      expect(resultado.carrito).toHaveLength(1)
    })
  })

  describe("UPDATE_QUANTITY", () => {
    it("actualiza la cantidad de un item específico", () => {
      const conItem = cartReducer(initialState, { type: "ADD_COOKIE", payload: mockCookie })
      const actualizado = cartReducer(conItem, {
        type: "UPDATE_QUANTITY",
        payload: { id: 1, cantidad: 5 },
      })
      expect(actualizado.carrito[0].cantidad).toBe(5)
    })

    it("elimina el item si la cantidad llega a 0", () => {
      const conItem = cartReducer(initialState, { type: "ADD_COOKIE", payload: mockCookie })
      const sinItem = cartReducer(conItem, {
        type: "UPDATE_QUANTITY",
        payload: { id: 1, cantidad: 0 },
      })
      expect(sinItem.carrito).toHaveLength(0)
    })

    it("elimina el item si la cantidad es negativa", () => {
      const conItem = cartReducer(initialState, { type: "ADD_COOKIE", payload: mockCookie })
      const sinItem = cartReducer(conItem, {
        type: "UPDATE_QUANTITY",
        payload: { id: 1, cantidad: -1 },
      })
      expect(sinItem.carrito).toHaveLength(0)
    })
  })

  describe("CLEAR_CART", () => {
    it("vacía el carrito por completo", () => {
      let state = cartReducer(initialState, { type: "ADD_COOKIE", payload: mockCookie })
      state = cartReducer(state, { type: "ADD_COOKIE", payload: mockCookie2 })
      state = cartReducer(state, { type: "CLEAR_CART" })
      expect(state.carrito).toHaveLength(0)
    })

    it("no afecta los favoritos al vaciar el carrito", () => {
      let state = cartReducer(initialState, { type: "ADD_COOKIE", payload: mockCookie })
      state = cartReducer(state, { type: "TOGGLE_FAVORITE", payload: 1 })
      state = cartReducer(state, { type: "CLEAR_CART" })
      expect(state.favoritos).toContain(1)
    })
  })

  describe("TOGGLE_FAVORITE", () => {
    it("agrega una galleta a favoritos", () => {
      const state = cartReducer(initialState, { type: "TOGGLE_FAVORITE", payload: 1 })
      expect(state.favoritos).toContain(1)
    })

    it("quita una galleta de favoritos si ya estaba marcada", () => {
      const conFav = cartReducer(initialState, { type: "TOGGLE_FAVORITE", payload: 1 })
      const sinFav = cartReducer(conFav, { type: "TOGGLE_FAVORITE", payload: 1 })
      expect(sinFav.favoritos).not.toContain(1)
    })

    it("no afecta el carrito al togglear favoritos", () => {
      const conItem = cartReducer(initialState, { type: "ADD_COOKIE", payload: mockCookie })
      const conFav = cartReducer(conItem, { type: "TOGGLE_FAVORITE", payload: 1 })
      expect(conFav.carrito).toHaveLength(1)
    })
  })

  describe("acción desconocida", () => {
    it("devuelve el estado sin cambios", () => {
      const state = cartReducer(initialState, { type: "ACCION_INEXISTENTE" })
      expect(state).toEqual(initialState)
    })
  })
})
