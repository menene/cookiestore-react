import { describe, it, expect } from "vitest"
import { screen } from "@testing-library/react"
import Navbar from "@/components/Navbar"
import { renderWithProviders, mockCartContext } from "./utils"

describe("Navbar", () => {
  it("muestra el nombre de la tienda", () => {
    renderWithProviders(<Navbar />)
    expect(screen.getByText("CookieStore")).toBeInTheDocument()
  })

  it("muestra el enlace al carrito", () => {
    renderWithProviders(<Navbar />)
    expect(screen.getByText("Carrito")).toBeInTheDocument()
  })

  it("no muestra el badge cuando el carrito está vacío", () => {
    renderWithProviders(<Navbar />, {
      cartValue: { ...mockCartContext, carrito: [] },
    })

    // El badge solo se renderiza si totalItems > 0
    expect(screen.queryByText("1")).not.toBeInTheDocument()
    expect(screen.queryByText("9+")).not.toBeInTheDocument()
  })

  it("muestra el badge con la cantidad total de items", () => {
    renderWithProviders(<Navbar />, {
      cartValue: {
        ...mockCartContext,
        carrito: [
          { id: 1, nombre: "Cookie A", precio: 2.5, cantidad: 2 },
          { id: 2, nombre: "Cookie B", precio: 3.0, cantidad: 1 },
        ],
      },
    })

    expect(screen.getByText("3")).toBeInTheDocument()
  })

  it("muestra '9+' cuando hay más de 9 items en el carrito", () => {
    renderWithProviders(<Navbar />, {
      cartValue: {
        ...mockCartContext,
        carrito: [{ id: 1, nombre: "Cookie A", precio: 2.5, cantidad: 10 }],
      },
    })

    expect(screen.getByText("9+")).toBeInTheDocument()
  })

  it("el logo navega a la página principal", () => {
    renderWithProviders(<Navbar />)
    const logoLink = screen.getByText("CookieStore").closest("a")
    expect(logoLink).toHaveAttribute("href", "/")
  })

  it("el ícono del carrito navega a /cart", () => {
    renderWithProviders(<Navbar />)
    const cartLink = screen.getByText("Carrito").closest("a")
    expect(cartLink).toHaveAttribute("href", "/cart")
  })
})
