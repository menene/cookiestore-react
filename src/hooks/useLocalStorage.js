import { useState, useEffect } from "react"

// useLocalStorage es un reemplazo directo de useState que sincroniza
// el valor con localStorage automáticamente.
//
// Demuestra useEffect con DEPENDENCIAS: el efecto re-corre cada vez
// que `storedValue` cambia — a diferencia del [] vacío que solo corre al montar.
export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    // Función de inicialización lazy: se ejecuta una sola vez al montar.
    // Intentamos leer el valor guardado; si no existe, usamos initialValue.
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch {
      return initialValue
    }
  })

  useEffect(() => {
    // Cada vez que storedValue cambia, sincronizamos con localStorage.
    // La dependencia [storedValue] asegura que esto corre en cada actualización.
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue))
    } catch {
      // localStorage puede estar bloqueado en modo privado — fallamos en silencio
    }
  }, [key, storedValue])

  // Misma API que useState: devuelve [valor, setter]
  return [storedValue, setStoredValue]
}
