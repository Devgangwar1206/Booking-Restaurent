import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Calendar,
  ArrowRight,
  ShieldCheck,
  Utensils,
} from 'lucide-react';
import TableReservationWidget from './TableReservationWidget';
import LuxuryAmbientBackground from './LuxuryAmbientBackground';
import { useTableHold } from '../context/TableHoldContext';

export default function BookingSection() {
  const { isBookingOpen, setIsBookingOpen, openBooking, formData, setFormData } = useTableHold();
  const [ambientMood, setAmbientMood] = useState('champagne');

  // Sync body class and trigger custom event to completely hide outer website header (Navbar)
  useEffect(() => {
    if (isBookingOpen) {
      document.body.classList.add('booking-active');
    } else {
      document.body.classList.remove('booking-active');
    }
    window.dispatchEvent(new Event('bookingStateChange'));

    return () => {
      document.body.classList.remove('booking-active');
      window.dispatchEvent(new Event('bookingStateChange'));
    };
  }, [isBookingOpen]);

  return (
    <section id="book" className="relative min-h-screen w-full bg-gradient-to-b from-stone-50 via-white to-stone-100 text-stone-900 flex flex-col items-center justify-center p-3 sm:p-6 lg:p-8 font-sans antialiased selection:bg-rose-500 selection:text-white overflow-hidden">
      {/* Dynamic Interactive Luxury Light Background with Subtle Bokeh */}
      <LuxuryAmbientBackground
        activeMood={ambientMood}
        onMoodChange={setAmbientMood}
        showMoodControls={!isBookingOpen}
      />

      {/* Main Content Area */}
      <main className="w-full mx-auto flex flex-col items-center justify-center relative z-10 transition-all duration-300 max-w-2xl">
        <AnimatePresence mode="wait">
          {!isBookingOpen ? (
            /* Clean & Simple Hero View */
            <motion.div
              key="landing-hero"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="w-full text-center space-y-6 sm:space-y-8 py-6 px-2"
            >

              {/* Title & Tagline */}
              <div className="space-y-3">
                <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-stone-900 leading-tight drop-shadow-xs">
                  Royal Spice&apos;s{' '}
                  <span className="bg-gradient-to-r from-rose-600 via-amber-600 to-rose-500 bg-clip-text text-transparent">
                    Dining & Lounge
                  </span>
                </h1>
                <p className="text-sm sm:text-base text-stone-600 max-w-lg mx-auto leading-relaxed font-normal">
                  Reserve your exact seat on our interactive live floor plan with real-time availability and 5-minute hold protection.
                </p>
              </div>

              {/* Atmosphere Pill Indicators */}
              <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs font-semibold text-stone-700">
                <span className="px-3 py-1 rounded-full bg-white/80 backdrop-blur-md border border-stone-200 shadow-2xs flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#e11d48]" />
                  <span>Center Lounge</span>
                </span>
                <span className="px-3 py-1 rounded-full bg-white/80 backdrop-blur-md border border-stone-200 shadow-2xs flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#059669]" />
                  <span>North Terrace</span>
                </span>
                <span className="px-3 py-1 rounded-full bg-white/80 backdrop-blur-md border border-stone-200 shadow-2xs flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#4f46e5]" />
                  <span>Velvet Alcoves</span>
                </span>
              </div>

              {/* The Hero "Book a Table Now" Button */}
              <div className="pt-2">
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => openBooking('SELECT_TABLE')}
                  className="group relative inline-flex items-center justify-center gap-3.5 px-9 py-5 rounded-2xl bg-gradient-to-r from-rose-600 via-rose-500 to-amber-500 hover:from-rose-500 hover:to-amber-400 text-white font-black text-base sm:text-lg shadow-xl shadow-rose-600/25 transition-all cursor-pointer border border-rose-400/40 overflow-hidden"
                >
                  <span className="absolute inset-0 w-1/2 h-full bg-white/20 skew-x-12 -translate-x-full group-hover:translate-x-[300%] transition-transform duration-1000 pointer-events-none" />

                  <Calendar className="w-5 h-5 text-white/95" />
                  <span>Book a Table Now</span>
                  <ArrowRight className="w-5 h-5 text-white/95 group-hover:translate-x-1 transition-transform" />
                </motion.button>
              </div>

              {/* Live Availability Subtitle */}
              <div className="flex items-center justify-center gap-3 text-xs text-stone-500 font-medium">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  Instant 5-Min Redis Hold Lock
                </span>
                <span>·</span>
                <span className="flex items-center gap-1.5">
                  <Utensils className="w-4 h-4 text-amber-600" />
                  10 Interactive Tables
                </span>
              </div>
            </motion.div>
          ) : (
            /* Full-Screen Immersive 1-Page Booking Application in Pure Light Theme */
            <motion.div
              key="booking-widget-fullscreen"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="fixed inset-0 z-[100] bg-white text-stone-900 flex flex-col w-screen h-[100dvh] overflow-y-auto no-scrollbar"
            >
              <TableReservationWidget
                formData={formData}
                setFormData={setFormData}
                onClose={() => setIsBookingOpen(false)}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </section>
  );
}