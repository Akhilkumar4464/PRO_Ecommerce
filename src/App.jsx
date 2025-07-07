import React from 'react'
import { Routes, Route } from 'react-router-dom'
import ProductCard from './components/ProductCard'
import ProductCatalog from './components/ProductCatalog'
import Header from './components/Header'
import CartCatalog from './components/CartCatalog'
import Footer from './components/Footer'
import About from './pages/About'
import Contact from './pages/Contact'

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex flex-col">
      {/* Header */}
      <Header />
      
      {/* Main Content */}
      <main className="flex-1 w-full">
        <Routes>
          <Route path="/" element={<ProductCard />} />
          <Route path="/products" element={<ProductCatalog />} />
          <Route path="/cart" element={<CartCatalog />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </main>
      
      {/* Footer */}
      <Footer />
    </div>
  )
}

export default App

 