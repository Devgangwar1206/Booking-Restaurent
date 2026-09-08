import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, Users, Clock, CheckCircle2, Loader2, Info, ShoppingBag } from 'lucide-react';
import { bookTable } from '../api/bookingApi';
import { useCart } from '../context/CartContext';

export default function BookingSection() {
  const { cartItems, cartTotal, clearCart } = useCart();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    date: '',
    time: '',
    guests: 2,
    tablePreference: 'No Preference',
    specialRequest: '',
    orderPreference: 'dine-in'
  });

  const [status, setStatus] = useState('idle');
  const [bookingId, setBookingId] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Auto-set orderPreference to preorder if cart has items and it was untouched
  useEffect(() => {
    if (cartItems.length > 0 && formData.orderPreference === 'dine-in') {
      setFormData(prev => ({ ...prev, orderPreference: 'preorder' }));
    } else if (cartItems.length === 0) {
      setFormData(prev => ({ ...prev, orderPreference: 'dine-in' }));
    }
  }, [cartItems.length]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    try {
      const submissionData = {
        ...formData,
        cartItems:
          formData.orderPreference === 'preorder'
            ? cartItems.map(item => ({
                id: item.menuItem.id,
                name: item.menuItem.name,
                price: item.menuItem.price,
                quantity: item.quantity
              }))
            : []
      };

      const response = await bookTable(submissionData);

      if (response.success) {
        setBookingId(response.bookingId || '');
        setStatus('success');

        if (formData.orderPreference === 'preorder') {
          clearCart();
        }
      }
    } catch (error) {
      setStatus('error');
      setErrorMessage(
        error.message || 'Failed to book table. Please try again.'
      );
    }
  };

  return (
    <section
      id="book"
      className="py-24 bg-brand-charcoal text-brand-cream relative overflow-hidden"
    >
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            'radial-gradient(circle at 20% 50%, #D4AF37 0%, transparent 50%)'
        }}
      ></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

          <div className="sticky top-32">
            <h2 className="text-brand-gold font-semibold tracking-[0.2em] uppercase text-sm mb-4">
              Reservations
            </h2>

            <h3 className="text-4xl md:text-5xl font-serif mb-6 leading-tight">
              Secure Your <br /> Culinary Experience
            </h3>

            <p className="text-gray-400 text-lg mb-10 font-light max-w-md">
              Whether it's a romantic dinner, a family gathering, or a business meeting, we ensure your dining experience is flawless.
            </p>

            <div className="space-y-6">

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full border border-brand-gold/30 flex items-center justify-center shrink-0">
                  <Info className="w-5 h-5 text-brand-gold" />
                </div>

                <div>
                  <h4 className="font-bold text-white mb-1">
                    Dietary Requirements
                  </h4>

                  <p className="text-gray-400 text-sm">
                    Please let us know of any allergies or dietary requirements in the special requests field.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full border border-brand-gold/30 flex items-center justify-center shrink-0">
                  <Users className="w-5 h-5 text-brand-gold" />
                </div>

                <div>
                  <h4 className="font-bold text-white mb-1">
                    Large Parties
                  </h4>

                  <p className="text-gray-400 text-sm">
                    For bookings of 10 or more guests, please contact us directly via phone.
                  </p>
                </div>
              </div>

            </div>

            {cartItems.length > 0 && (
              <div className="mt-12 bg-white/5 border border-brand-gold/30 rounded-2xl p-6 backdrop-blur-sm hidden lg:block">

                <div className="flex items-center gap-3 mb-4">
                  <ShoppingBag className="w-5 h-5 text-brand-gold" />
                  <h4 className="font-serif text-xl text-white">
                    Your Pre-Order Cart
                  </h4>
                </div>

                <div className="space-y-3 mb-4 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                  {cartItems.map(item => (
                    <div
                      key={item.menuItem.id}
                      className="flex justify-between text-sm"
                    >
                      <span className="text-gray-300">
                        {item.quantity}x {item.menuItem.name}
                      </span>

                      <span className="text-white font-medium">
                        ₹{item.menuItem.price * item.quantity}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between border-t border-white/10 pt-4 font-bold text-lg text-brand-gold">
                  <span>Total Bill</span>
                  <span>₹{cartTotal}</span>
                </div>

              </div>
            )}
          </div>

          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-10 shadow-2xl relative">

            <AnimatePresence mode="wait">

              {status === 'success' ? (

                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-10"
                >

                  <div className="w-24 h-24 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 size={48} />
                  </div>

                  <h3 className="text-3xl font-serif text-white mb-2">
                    Table Reserved!
                  </h3>

                  <p className="text-gray-400 mb-8">
                    We look forward to hosting you, {formData.fullName}.
                  </p>

                  <div className="bg-black/20 rounded-xl p-6 mb-8 text-left border border-white/5">

                    <div className="grid grid-cols-2 gap-4 text-sm mb-4">

                      <div className="text-gray-500">Date</div>
                      <div className="text-white font-medium text-right">
                        {formData.date}
                      </div>

                      <div className="text-gray-500">Time</div>
                      <div className="text-white font-medium text-right">
                        {formData.time}
                      </div>

                      <div className="text-gray-500">Guests</div>
                      <div className="text-white font-medium text-right">
                        {formData.guests} People
                      </div>

                      <div className="text-gray-500">Booking ID</div>
                      <div className="text-brand-gold font-medium text-right">
                        {bookingId}
                      </div>

                    </div>

                    {formData.orderPreference === 'preorder' && (
                      <div className="pt-4 border-t border-white/10 mt-4">
                        <div className="text-gray-500 mb-2">
                          Pre-ordered Items
                        </div>

                        <div className="text-brand-gold font-medium">
                          Your delicious meal is pre-ordered!
                        </div>
                      </div>
                    )}

                  </div>

                  <button
                    onClick={() => {
                      setStatus('idle');
                      setFormData({
                        ...formData,
                        specialRequest: ''
                      });
                    }}
                    className="w-full py-4 bg-brand-gold text-brand-charcoal font-bold rounded-xl hover:bg-yellow-500 transition-colors"
                  >
                    Make Another Booking
                  </button>

                </motion.div>

              ) : (

                <motion.div
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >

                  <form onSubmit={handleSubmit} className="space-y-6">

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                      <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                          Full Name
                        </label>

                        <input
                          required
                          type="text"
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleChange}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-gold transition-colors"
                          placeholder="John Doe"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                          Phone
                        </label>

                        <input
                          required
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-gold transition-colors"
                          placeholder="+91 98765 43210"
                        />
                      </div>

                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                        Email Address
                      </label>

                      <input
                        required
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-gold transition-colors"
                        placeholder="john@example.com"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                      <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                          Date
                        </label>

                        <div className="relative">
                          <input
                            required
                            type="date"
                            name="date"
                            value={formData.date}
                            onChange={handleChange}
                            min={new Date().toISOString().split('T')[0]}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-gold transition-colors appearance-none [&::-webkit-calendar-picker-indicator]:invert"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                          Time
                        </label>

                        <select
                          required
                          name="time"
                          value={formData.time}
                          onChange={handleChange}
                          className="w-full bg-brand-charcoal border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-gold transition-colors appearance-none"
                        >
                          <option value="">Select</option>
                          <option value="11:00 AM">11:00 AM</option>
                          <option value="12:00 PM">12:00 PM</option>
                          <option value="1:00 PM">1:00 PM</option>
                          <option value="2:00 PM">2:00 PM</option>
                          <option value="6:00 PM">6:00 PM</option>
                          <option value="7:00 PM">7:00 PM</option>
                          <option value="8:00 PM">8:00 PM</option>
                          <option value="9:00 PM">9:00 PM</option>
                          <option value="10:00 PM">10:00 PM</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                          Guests
                        </label>

                        <select
                          required
                          name="guests"
                          value={formData.guests}
                          onChange={handleChange}
                          className="w-full bg-brand-charcoal border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-gold transition-colors appearance-none"
                        >
                          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => (
                            <option key={n} value={n}>
                              {n} {n === 1 ? 'Person' : 'People'}
                            </option>
                          ))}
                        </select>
                      </div>

                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                        Table Preference
                      </label>

                      <select
                        name="tablePreference"
                        value={formData.tablePreference}
                        onChange={handleChange}
                        className="w-full bg-brand-charcoal border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-gold transition-colors appearance-none"
                      >
                        <option value="No Preference">No Preference</option>
                        <option value="Indoor">Indoor</option>
                        <option value="Outdoor">Outdoor</option>
                        <option value="Window Seat">Window Seat</option>
                        <option value="Family Table">Family Table</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                        Special Requests (Optional)
                      </label>

                      <textarea
                        name="specialRequest"
                        value={formData.specialRequest}
                        onChange={handleChange}
                        rows={2}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-gold transition-colors resize-none"
                        placeholder="Any allergies or special occasions?"
                      ></textarea>
                    </div>

                    {cartItems.length > 0 && (
                      <div className="bg-black/20 border border-white/5 rounded-xl p-6">

                        <label className="block text-sm font-bold text-white uppercase tracking-wider mb-4">
                          Dining Order Preference
                        </label>

                        <div className="flex flex-col sm:flex-row gap-4">

                          <label className="flex items-center gap-3 cursor-pointer group">

                            <input
                              type="radio"
                              name="orderPreference"
                              value="preorder"
                              checked={formData.orderPreference === 'preorder'}
                              onChange={handleChange}
                              className="accent-brand-gold w-4 h-4 cursor-pointer"
                            />

                            <span
                              className={`text-sm transition-colors ${
                                formData.orderPreference === 'preorder'
                                  ? 'text-brand-gold font-medium'
                                  : 'text-gray-300 group-hover:text-white'
                              }`}
                            >
                              Pre-order these items (₹{cartTotal})
                            </span>

                          </label>

                          <label className="flex items-center gap-3 cursor-pointer group">

                            <input
                              type="radio"
                              name="orderPreference"
                              value="dine-in"
                              checked={formData.orderPreference === 'dine-in'}
                              onChange={handleChange}
                              className="accent-brand-gold w-4 h-4 cursor-pointer"
                            />

                            <span
                              className={`text-sm transition-colors ${
                                formData.orderPreference === 'dine-in'
                                  ? 'text-brand-gold font-medium'
                                  : 'text-gray-300 group-hover:text-white'
                              }`}
                            >
                              I'll order at the restaurant
                            </span>

                          </label>

                        </div>

                        {/* Mobile view cart summary */}
                        <div className="mt-4 pt-4 border-t border-white/5 lg:hidden">

                          <div className="flex justify-between text-sm mb-2 text-gray-400">
                            <span>Items in Cart:</span>
                            <span className="text-white font-medium">
                              {cartItems.reduce((a, b) => a + b.quantity, 0)}
                            </span>
                          </div>

                          <div className="flex justify-between text-sm text-brand-gold font-bold">
                            <span>Total Bill:</span>
                            <span>₹{cartTotal}</span>
                          </div>

                        </div>

                      </div>
                    )}

                    {status === 'error' && (
                      <div className="text-red-400 text-sm bg-red-400/10 p-3 rounded-lg border border-red-400/20">
                        {errorMessage}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={status === 'loading'}
                      className="w-full py-4 bg-brand-gold text-brand-charcoal font-bold rounded-xl hover:bg-yellow-500 transition-colors flex justify-center items-center gap-2"
                    >
                      {status === 'loading' ? (
                        <>
                          <Loader2 className="animate-spin w-5 h-5" />
                          Processing...
                        </>
                      ) : (
                        'Confirm Reservation'
                      )}
                    </button>

                  </form>

                </motion.div>
              )}

            </AnimatePresence>

          </div>

        </div>

      </div>
    </section>
  );
}