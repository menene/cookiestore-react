import { BrowserRouter, Routes, Route } from "react-router-dom"
import { CartProvider } from "@/context/CartContext"
import Navbar from "@/components/Navbar"
import Catalogo from "@/pages/Catalogo"
import DetalleCookie from "@/pages/DetalleCookie"

// Compara este App con el de la rama 02-router:
//   - Ya no hay useState aquí
//   - Ya no hay agregarAlCarrito aquí
//   - Ya no se pasa NINGUNA prop a las rutas
//
// El estado del carrito vive en CartProvider. Cualquier componente
// dentro del Provider puede leerlo o modificarlo con useCart().
function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-background">
          <Navbar />
          <Routes>
            <Route path="/" element={<Catalogo />} />
            <Route path="/galleta/:id" element={<DetalleCookie />} />
          </Routes>
        </div>
      </BrowserRouter>
    </CartProvider>
  )
}

export default App
