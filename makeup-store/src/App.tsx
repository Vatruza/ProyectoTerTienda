import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Home from './pages/Home'
import Products from './pages/Products'
import Offers from './pages/Offers'
import Contact from './pages/Contact'
import Cart from './pages/Cart'
import OrderHistory from './pages/OrderHistory'
import { CartProvider } from './context/CartContext'
import './App.css'

function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <div className="app">
          <Header />
          
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/productos" element={<Products />} />
              <Route path="/ofertas" element={<Offers />} />
              <Route path="/contacto" element={<Contact />} />
              <Route path="/carrito" element={<Cart />} />
              <Route path="/pedidos" element={<OrderHistory />} />
            </Routes>
          </main>

        <footer className="footer">
          <p>© 2026 Ter tienda - Tu tienda de maquillaje favorita 💖</p>
        </footer>
      </div>
    </BrowserRouter>
  </CartProvider>
  )
}

export default App
