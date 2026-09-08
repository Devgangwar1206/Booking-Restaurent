import { useState } from 'react'
import { Routes, Route } from 'react-router-dom';
import heroImg from './assets/hero.png'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import './App.css'
import Hero from './components/Hero'
import Navbar from './components/Navbar'
import About from './components/About'
import SignatureDishes from './components/signatureDishes'
import Menu from './components/Menu'
import BookingSection from './components/BookingSection'
import Gallery from './components/Gallery'
import Testimonials from './components/Testimonials'
import Contact from './components/Contact'
import Footer from './components/Footer'
import CartSidebar from './components/CartSidebar'
import AdminLogin from './components/AdminLogin'
import AdminDashboard from './components/AdminDashboard'

function RestaurantHome() {
  return (
    <main className="min-h-screen">
       <Navbar />
       <CartSidebar/>
       <Hero/>
       <About />
       <SignatureDishes />
       <Menu />
       <BookingSection />
       <Gallery />
       <Testimonials />
       <Contact />
       <Footer />
    </main>
  )
}
export default function App() {
  return (
    <Routes>
      {/* Main Website */}
      <Route path="/" element={<RestaurantHome />} />

      {/* Admin */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin" element={<AdminDashboard />} />
    </Routes>
  );
}