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
import AdminDashboard from './components/AdminDashboard'
import AdminLogin from './components/AdminLogin';
import ProtectedRoute from './components/ProtectedRoute';
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
import CuteHoldClock from './components/CuteHoldClock';
import { useTableHold } from './context/TableHoldContext';

export default function App() {
  const { activeHold, clearActiveHold, isBookingOpen, openBooking, selectedTable } = useTableHold();

  return (
    <>
      {/* GLOBAL 5-MINUTE LIVE COUNTDOWN CLOCK - Stays visible everywhere on website */}
      {activeHold && (
        <CuteHoldClock
          expiresAt={activeHold.expiresAt}
          tableNumber={activeHold.tableNumber || selectedTable?.tableNumber || `Table`}
          tableName={activeHold.tableName || selectedTable?.name || 'Dining Table'}
          onExpire={clearActiveHold}
          totalDurationSeconds={300}
          isOutsideForm={!isBookingOpen}
          onResumeBooking={() => openBooking('CART_REVIEW')}
        />
      )}

      <Routes>
        {/* Main Website */}
        <Route path="/" element={<RestaurantHome />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<AdminDashboard />}/>
        </Route>

        <Route path="/login" element={<AdminLogin />}/>
      </Routes>
    </>
  );
}