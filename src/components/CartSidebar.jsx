import { motion, AnimatePresence } from 'motion/react';
import { X, Minus, Plus, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function CartSidebar() {
  const {
    cartItems,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    cartTotal
  } = useCart();

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-100"
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-101 flex flex-col"
          >
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-6 h-6 text-brand-gold" />
                <h2 className="font-serif text-2xl text-brand-charcoal font-bold">
                  Your Order
                </h2>
              </div>

              <button
                onClick={() => setIsCartOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={24} className="text-gray-500" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {cartItems.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-4">
                  <ShoppingBag size={48} className="opacity-20" />
                  <p>Your cart is empty.</p>
                </div>
              ) : (
                cartItems.map((item) => (
                  <div
                    key={item.menuItem.id}
                    className="flex gap-4 items-center bg-gray-50 p-4 rounded-2xl"
                  >
                    <div className="relative w-20 h-20 rounded-xl overflow-hidden shrink-0">
                      <img
                        src={item.menuItem.image}
                        alt={item.menuItem.name}
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex-1">
                      <h4 className="font-bold text-brand-charcoal text-sm md:text-base">
                        {item.menuItem.name}
                      </h4>

                      <p className="text-brand-burgundy font-bold text-sm mt-1">
                        ₹{item.menuItem.price}
                      </p>

                      <div className="flex items-center gap-4 mt-3">
                        <button
                          onClick={() =>
                            updateQuantity(
                              item.menuItem.id,
                              item.quantity - 1
                            )
                          }
                          className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:text-brand-charcoal hover:border-brand-charcoal transition-colors"
                        >
                          <Minus size={14} />
                        </button>

                        <span className="font-medium w-4 text-center">
                          {item.quantity}
                        </span>

                        <button
                          onClick={() =>
                            updateQuantity(
                              item.menuItem.id,
                              item.quantity + 1
                            )
                          }
                          className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:text-brand-charcoal hover:border-brand-charcoal transition-colors"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>

                    <div className="font-bold text-brand-charcoal">
                      ₹{item.menuItem.price * item.quantity}
                    </div>
                  </div>
                ))
              )}
            </div>

            {cartItems.length > 0 && (
              <div className="p-6 border-t border-gray-100 bg-gray-50">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-gray-500 font-medium">
                    Subtotal
                  </span>

                  <span className="text-2xl font-bold text-brand-charcoal">
                    ₹{cartTotal}
                  </span>
                </div>

                <a
                  href="#book"
                  onClick={() => setIsCartOpen(false)}
                  className="w-full block text-center py-4 bg-brand-charcoal text-white font-bold rounded-xl hover:bg-black transition-colors"
                >
                  Proceed to Book Table
                </a>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}