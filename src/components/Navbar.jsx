import { useState, useEffect } from 'react';
import { Menu, X, UtensilsCrossed, ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { cartItems, setIsCartOpen } = useCart();

  const totalCartItems = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'About', href: '#about' },
    { name: 'Menu', href: '#menu' },
    { name: 'Gallery', href: '#gallery' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-brand-charcoal/95 backdrop-blur-md py-3 shadow-lg'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">

          <div className="shrink-0 flex items-center gap-2">
            <UtensilsCrossed
              className={`w-8 h-8 ${
                isScrolled ? 'text-brand-gold' : 'text-brand-cream'
              }`}
            />

            <span
              className={`font-serif text-2xl font-bold tracking-wider ${
                isScrolled ? 'text-brand-cream' : 'text-brand-cream'
              }`}
            >
              Royal Spice
            </span>
          </div>

          <div className="hidden md:flex items-center space-x-8">

            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className={`text-sm font-medium tracking-widest uppercase hover:text-brand-gold transition-colors ${
                  isScrolled ? 'text-gray-300' : 'text-white/90'
                }`}
              >
                {link.name}
              </a>
            ))}

            <button
              onClick={() => setIsCartOpen(true)}
              className={`relative p-2 transition-colors ${
                isScrolled ? 'text-white' : 'text-white'
              } hover:text-brand-gold`}
            >
              <ShoppingBag size={24} />

              {totalCartItems > 0 && (
                <span className="absolute top-0 right-0 -mt-1 -mr-1 flex h-5 w-5 items-center justify-center rounded-full bg-brand-gold text-[10px] font-bold text-brand-charcoal">
                  {totalCartItems}
                </span>
              )}
            </button>

            <a
              href="#book"
              className="bg-brand-gold hover:bg-yellow-500 text-brand-charcoal px-6 py-2.5 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 shadow-[0_4px_14px_0_rgba(212,175,55,0.39)]"
            >
              Book a Table
            </a>
          </div>

          <div className="md:hidden flex items-center gap-4">

            <button
              onClick={() => setIsCartOpen(true)}
              className={`relative p-2 transition-colors ${
                isScrolled ? 'text-white' : 'text-white'
              } hover:text-brand-gold`}
            >
              <ShoppingBag size={24} />

              {totalCartItems > 0 && (
                <span className="absolute top-0 right-0 -mt-1 -mr-1 flex h-5 w-5 items-center justify-center rounded-full bg-brand-gold text-[10px] font-bold text-brand-charcoal">
                  {totalCartItems}
                </span>
              )}
            </button>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`${
                isScrolled ? 'text-white' : 'text-white'
              } hover:text-brand-gold p-2`}
            >
              {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 w-full bg-brand-charcoal border-t border-white/10 shadow-xl md:hidden"
          >
            <div className="flex flex-col px-4 pt-2 pb-6 space-y-2">

              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-3 py-4 text-center text-white border-b border-white/5 hover:text-brand-gold transition-colors"
                >
                  {link.name}
                </a>
              ))}

              <div className="pt-4 flex justify-center">
                <a
                  href="#book"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="bg-brand-gold text-brand-charcoal px-8 py-3 rounded-full font-bold w-full text-center"
                >
                  Book a Table
                </a>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}