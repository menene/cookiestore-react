import { useState, useEffect } from "react"

// useDebounce retrasa la actualización de un valor hasta que el usuario
// deja de cambiarlo durante `delay` milisegundos.
//
// Demuestra el concepto más importante de esta rama que aún no habíamos visto:
// la CLEANUP FUNCTION de useEffect. El `return () => clearTimeout(timer)` se
// ejecuta antes de que el efecto corra de nuevo — cancelando el timer anterior.
// Sin esto, cada tecla acumularía un timer sin limpiar (memory leak).
export function useDebounce(value, delay = 300) {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    // Programamos actualizar el valor debounced después de `delay` ms
    const timer = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    // Cleanup: si `value` cambia antes de que pasen los ms,
    // cancelamos el timer y programamos uno nuevo desde cero.
    return () => clearTimeout(timer)
  }, [value, delay]) // re-ejecutar cada vez que value o delay cambien

  return debouncedValue
}
