import { useState, useEffect } from "react"

// Vite expone las variables de entorno con prefijo VITE_ a través de import.meta.env.
// El valor viene del archivo .env (no versionado — ver .env.example como plantilla).
const API_URL = import.meta.env.VITE_API_URL

// Custom hook que encapsula toda la lógica de carga del catálogo.
// Cualquier componente que necesite las galletas puede llamar a useFetchCookies()
// sin repetir el fetch, el manejo de loading ni el manejo de errores.
export function useFetchCookies() {
  const [cookies, setCookies] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    // useEffect con array de dependencias vacío [] se ejecuta exactamente una vez:
    // cuando el componente se monta por primera vez.
    // Puedes verlo en el Network tab del navegador — una sola petición GET.
    fetch(API_URL)
      .then((res) => {
        if (!res.ok) throw new Error("No se pudo cargar el catálogo.")
        return res.json()
      })
      .then((data) => {
        setCookies(data)
        setLoading(false)
      })
      .catch((err) => {
        setError(err.message)
        setLoading(false)
      })
  }, []) // <- [] significa: no hay dependencias, ejecutar solo al montar

  return { cookies, loading, error }
}
