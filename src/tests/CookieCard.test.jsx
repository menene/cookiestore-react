import { describe, it, expect, vi } from "vitest"
import { screen, fireEvent } from "@testing-library/react"
import CookieCard from "@/components/CookieCard"
import { renderWithProviders, mockCartContext } from "./utils"

const mockCookie = {
  id: 1,
  nombre: "Chocolate Chip Clásica",
  descripcion: "Masa suave con chips de chocolate.",
  descripcion_larga: "Descripción larga de prueba.",
  precio: 2.5,
  emoji: "🍪",
  etiqueta: "Clásica",
  calorias: 210,
  peso_g: 65,
  ingredientes: ["Harina", "Mantequilla"],
}

describe("CookieCard", () => {

  it("muestra el nombre de la galleta", () => {
    renderWithProviders(<CookieCard cookie={mockCookie} />)
    expect(screen.getByText("Chocolate Chip Clásica")).toBeInTheDocument()
  })

  it("muestra el precio formateado correctamente", () => {
    renderWithProviders(<CookieCard cookie={mockCookie} />)
    expect(screen.getByText("Q2.50")).toBeInTheDocument()
  })

  it("muestra la descripción corta", () => {
    renderWithProviders(<CookieCard cookie={mockCookie} />)
    expect(screen.getByText("Masa suave con chips de chocolate.")).toBeInTheDocument()
  })

  it("muestra la etiqueta de categoría", () => {
    renderWithProviders(<CookieCard cookie={mockCookie} />)
    expect(screen.getByText("Clásica")).toBeInTheDocument()
  })

  it("llama a agregarAlCarrito con la galleta correcta al hacer clic en Agregar", () => {
    const agregarAlCarrito = vi.fn()
    renderWithProviders(<CookieCard cookie={mockCookie} />, {
      cartValue: { ...mockCartContext, agregarAlCarrito },
    })

    fireEvent.click(screen.getByText("Agregar"))
    expect(agregarAlCarrito).toHaveBeenCalledOnce()
    expect(agregarAlCarrito).toHaveBeenCalledWith(mockCookie)
  })

  it("llama a toggleFavorito con el id correcto al hacer clic en el corazón", () => {
    const toggleFavorito = vi.fn()
    renderWithProviders(<CookieCard cookie={mockCookie} />, {
      cartValue: { ...mockCartContext, toggleFavorito },
    })

    fireEvent.click(screen.getByLabelText("Agregar a favoritas"))
    expect(toggleFavorito).toHaveBeenCalledOnce()
    expect(toggleFavorito).toHaveBeenCalledWith(1)
  })

  it("muestra el corazón relleno cuando la galleta es favorita", () => {
    renderWithProviders(<CookieCard cookie={mockCookie} />, {
      cartValue: { ...mockCartContext, esFavorito: vi.fn(() => true) },
    })

    expect(screen.getByLabelText("Quitar de favoritas")).toBeInTheDocument()
  })

  it("no llama a agregarAlCarrito al hacer clic en el área de contenido", () => {
    const agregarAlCarrito = vi.fn()
    renderWithProviders(<CookieCard cookie={mockCookie} />, {
      cartValue: { ...mockCartContext, agregarAlCarrito },
    })

    // Clic en el nombre — navega al detalle, no agrega al carrito
    fireEvent.click(screen.getByText("Chocolate Chip Clásica"))
    expect(agregarAlCarrito).not.toHaveBeenCalled()
  })
})
