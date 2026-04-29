import { useState } from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Navbar from "@/components/Navbar"
import Catalogo from "@/pages/Catalogo"
import DetalleCookie from "@/pages/DetalleCookie"

// App sigue siendo el dueño del estado del carrito.
// El problema ahora es doble: necesitamos pasar TANTO agregarAlCarrito
// COMO el array carrito a las páginas que los necesiten.
// Cada prop extra que añadimos es un nivel más de prop drilling.
function App() {
  const [carrito, setCarrito] = useState([])

  const agregarAlCarrito = (cookie) => {
    setCarrito([...carrito, cookie])
  }

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-background">

        {/* Navbar persiste en todas las rutas */}
        <Navbar cartCount={carrito.length} />

        <Routes>
          {/* Catalogo recibe tanto carrito como agregarAlCarrito — más prop drilling */}
          <Route
            path="/"
            element={
              <Catalogo
                carrito={carrito}
                agregarAlCarrito={agregarAlCarrito}
              />
            }
          />
          <Route
            path="/galleta/:id"
            element={<DetalleCookie agregarAlCarrito={agregarAlCarrito} />}
          />
        </Routes>

      </div>
    </BrowserRouter>
  )
}

export default App
