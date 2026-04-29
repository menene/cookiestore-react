import { BrowserRouter, Routes, Route } from "react-router-dom"
import { CartProvider } from "@/context/CartContext"
import Navbar from "@/components/Navbar"
import Catalogo from "@/pages/Catalogo"
import DetalleCookie from "@/pages/DetalleCookie"
import CartPage from "@/pages/CartPage"
import CheckoutPage from "@/pages/CheckoutPage"

function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-background">
          <Navbar />
          <Routes>
            <Route path="/" element={<Catalogo />} />
            <Route path="/galleta/:id" element={<DetalleCookie />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
          </Routes>
        </div>
      </BrowserRouter>
    </CartProvider>
  )
}

export default App
