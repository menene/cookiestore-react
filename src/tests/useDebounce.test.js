import { describe, it, expect, beforeEach, afterEach } from "vitest"
import { renderHook, act } from "@testing-library/react"
import { useDebounce } from "@/hooks/useDebounce"

// vi.useFakeTimers() reemplaza setTimeout/clearTimeout con versiones controlables.
// Esto nos permite avanzar el tiempo manualmente sin esperar milisegundos reales.

describe("useDebounce", () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  it("devuelve el valor inicial inmediatamente", () => {
    const { result } = renderHook(() => useDebounce("hola", 300))
    expect(result.current).toBe("hola")
  })

  it("no actualiza el valor antes de que pase el delay", () => {
    const { result, rerender } = renderHook(({ value }) => useDebounce(value, 300), {
      initialProps: { value: "inicial" },
    })

    rerender({ value: "nuevo" })

    // Avanzamos 299ms — aún no debe haber actualizado
    act(() => vi.advanceTimersByTime(299))
    expect(result.current).toBe("inicial")
  })

  it("actualiza el valor exactamente al cumplirse el delay", () => {
    const { result, rerender } = renderHook(({ value }) => useDebounce(value, 300), {
      initialProps: { value: "inicial" },
    })

    rerender({ value: "nuevo" })

    act(() => vi.advanceTimersByTime(300))
    expect(result.current).toBe("nuevo")
  })

  it("cancela el timer anterior si el valor cambia rápidamente (cleanup)", () => {
    // Este test verifica que la cleanup function de useEffect funciona correctamente.
    // Si no hubiera cleanup, cada cambio acumularía un timer y el valor
    // podría actualizarse múltiples veces.
    const { result, rerender } = renderHook(({ value }) => useDebounce(value, 300), {
      initialProps: { value: "a" },
    })

    rerender({ value: "b" })
    rerender({ value: "c" })
    rerender({ value: "d" })

    // Solo debe aplicar el último valor — los anteriores fueron cancelados
    act(() => vi.advanceTimersByTime(300))
    expect(result.current).toBe("d")
  })

  it("respeta el delay personalizado", () => {
    const { result, rerender } = renderHook(({ value }) => useDebounce(value, 1000), {
      initialProps: { value: "inicial" },
    })

    rerender({ value: "nuevo" })

    act(() => vi.advanceTimersByTime(500))
    expect(result.current).toBe("inicial")

    act(() => vi.advanceTimersByTime(500))
    expect(result.current).toBe("nuevo")
  })
})
