import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getStoredBookings, deleteStoredBooking } from '../api/bookingApi';
import {
  LogOut,
  CalendarDays,
  Users,
  Clock,
  ShoppingBag,
  UtensilsCrossed,
  Phone,
  Mail,
  FileText,
  CheckCircle,
  Trash2,
  CheckCircle2
} from 'lucide-react';
import { motion } from 'motion/react';

export default function AdminDashboard() {
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
  // Check authentication
  const isLoggedIn = localStorage.getItem('rs_admin_auth');

  if (isLoggedIn !== 'true') {
    navigate('/admin/login');
    return;
  }

  // Load bookings
  const loadBookings = async () => {
    try {
      const loadedBookings = await getStoredBookings();

      // Sort by newest first
      loadedBookings.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() -
          new Date(a.createdAt).getTime()
      );

      setBookings(loadedBookings);
    } catch (error) {
      console.error('Failed to load bookings:', error);
      setBookings([]);
    } finally {
      setIsLoading(false);
    }
  };

  loadBookings();
}, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('rs_admin_auth');
    navigate('/');
  };

  const handleDelete = async (id) => {
  try {
    await deleteStoredBooking(id);

    setBookings(prev =>
      prev.filter(b => b.id !== id)
    );

  } catch (error) {
    console.error("Failed to delete booking:", error);
    alert("Failed to delete booking.");
  }
};

  const getFilteredBookings = () => {
    if (filter === 'all') return bookings;

    const today = new Date().toISOString().split('T')[0];

    return bookings.filter(b => b.date === today);
  };

  const filteredBookings = getFilteredBookings();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7] font-sans">
      {/* Admin Navbar */}
      <nav className="bg-brand-charcoal text-white py-4 px-6 sticky top-0 z-50 shadow-md">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <UtensilsCrossed className="w-6 h-6 text-brand-gold" />
            <span className="font-serif text-xl font-bold tracking-wider">
              Royal Spice Admin
            </span>
          </div>

          <div className="flex items-center gap-6">
            <Link
              to="/"
              className="text-gray-300 hover:text-white text-sm transition-colors"
            >
              View Website
            </Link>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-full text-sm font-medium transition-colors"
            >
              <LogOut size={16} /> Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Dashboard Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-serif text-brand-charcoal font-bold">
              Booking Management
            </h1>

            <p className="text-gray-500 mt-1">
              Overview of all customer reservations and pre-orders.
            </p>
          </div>

          <div className="flex bg-gray-200 rounded-full p-1">
            <button
              onClick={() => setFilter('all')}
              className={`px-6 py-2 rounded-full text-sm font-bold transition-colors ${
                filter === 'all'
                  ? 'bg-brand-charcoal text-brand-gold shadow-md'
                  : 'text-gray-600 hover:text-brand-charcoal'
              }`}
            >
              All Bookings
            </button>

            <button
              onClick={() => setFilter('today')}
              className={`px-6 py-2 rounded-full text-sm font-bold transition-colors ${
                filter === 'today'
                  ? 'bg-brand-charcoal text-brand-gold shadow-md'
                  : 'text-gray-600 hover:text-brand-charcoal'
              }`}
            >
              Today's Bookings
            </button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center">
              <CalendarDays size={24} />
            </div>

            <div>
              <p className="text-sm text-gray-500 font-medium">
                Total Reservations
              </p>

              <p className="text-2xl font-bold text-brand-charcoal">
                {bookings.length}
              </p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="w-12 h-12 bg-green-50 text-green-600 rounded-full flex items-center justify-center">
              <ShoppingBag size={24} />
            </div>

            <div>
              <p className="text-sm text-gray-500 font-medium">
                Pre-orders
              </p>

              <p className="text-2xl font-bold text-brand-charcoal">
                {bookings.filter(
                  b => b.orderPreference === 'preorder'
                ).length}
              </p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="w-12 h-12 bg-brand-gold/10 text-brand-gold rounded-full flex items-center justify-center">
              <Users size={24} />
            </div>

            <div>
              <p className="text-sm text-gray-500 font-medium">
                Total Guests
              </p>

              <p className="text-2xl font-bold text-brand-charcoal">
                {bookings.reduce(
                  (sum, b) => sum + (Number(b.guests) || 0),
                  0
                )}
              </p>
            </div>
          </div>

        </div>

        {/* Bookings Grid */}
        {filteredBookings.length === 0 ? (
          <div className="bg-white rounded-3xl border border-gray-100 p-16 text-center shadow-sm">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <CalendarDays className="w-10 h-10 text-gray-300" />
            </div>

            <h3 className="text-xl font-bold text-brand-charcoal mb-2">
              No Bookings Found
            </h3>

            <p className="text-gray-500">
              There are currently no reservations to display.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {filteredBookings.map((booking) => (
              <motion.div
                key={booking.bookingId}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col"
              >

                {/* Header */}
                <div className="bg-brand-charcoal text-white p-5 flex justify-between items-center">
                  <div>
                    <span className="text-brand-gold font-bold">
                      {booking.bookingId}
                    </span>

                    <p className="text-xs text-gray-400 mt-1">
                      Booked:{' '}
                      {new Date(
                        booking.createdAt
                      ).toLocaleString()}
                    </p>
                  </div>

                  <div
                    className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                      booking.orderPreference === 'preorder'
                        ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                        : 'bg-white/10 text-gray-300'
                    }`}
                  >
                    {booking.orderPreference === 'preorder'
                      ? 'Pre-ordered'
                      : 'Dine-In'}
                  </div>
                </div>

                {/* Body */}
                <div className="p-6 grow">

                  <div className="grid grid-cols-2 gap-y-6 gap-x-4 mb-6">

                    <div>
                      <p className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-1">
                        Customer
                      </p>

                      <p className="font-bold text-brand-charcoal">
                        {booking.fullName}
                      </p>

                      <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                        <Phone size={14} /> {booking.phone}
                      </div>

                      <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                        <Mail size={14} /> {booking.email}
                      </div>
                    </div>

                    <div>
                      <p className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-1">
                        Reservation Info
                      </p>

                      <div className="flex items-center gap-2 text-brand-charcoal font-medium mt-1">
                        <CalendarDays
                          size={16}
                          className="text-brand-gold"
                        />
                        {booking.date}
                      </div>

                      <div className="flex items-center gap-2 text-brand-charcoal font-medium mt-1">
                        <Clock
                          size={16}
                          className="text-brand-gold"
                        />
                        {booking.time}
                      </div>

                      <div className="flex items-center gap-2 text-brand-charcoal font-medium mt-1">
                        <Users
                          size={16}
                          className="text-brand-gold"
                        />
                        {booking.guests} People
                      </div>
                    </div>

                  </div>

                  {booking.tablePreference !== 'No Preference' && (
                    <div className="mb-4 bg-gray-50 p-3 rounded-xl border border-gray-100 flex items-start gap-3">
                      <CheckCircle
                        size={18}
                        className="text-gray-400 shrink-0 mt-0.5"
                      />

                      <div>
                        <p className="text-xs text-gray-500 uppercase font-bold">
                          Table Preference
                        </p>

                        <p className="text-sm font-medium text-brand-charcoal">
                          {booking.tablePreference}
                        </p>
                      </div>
                    </div>
                  )}

                  {booking.specialRequest && (
                    <div className="mb-6 bg-yellow-50 p-3 rounded-xl border border-yellow-100 flex items-start gap-3">
                      <FileText
                        size={18}
                        className="text-yellow-600 shrink-0 mt-0.5"
                      />

                      <div>
                        <p className="text-xs text-yellow-700 uppercase font-bold">
                          Special Request
                        </p>

                        <p className="text-sm text-yellow-800 italic">
                          "{booking.specialRequest}"
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Pre-order Details */}
                  {booking.orderPreference === 'preorder' &&
                    booking.cartItems &&
                    booking.cartItems.length > 0 && (
                      <div className="mt-6 pt-6 border-t border-gray-100">

                        <div className="flex items-center gap-2 mb-4">
                          <ShoppingBag
                            size={18}
                            className="text-brand-charcoal"
                          />

                          <h4 className="font-bold text-brand-charcoal">
                            Pre-ordered Items
                          </h4>
                        </div>

                        <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">

                          <ul className="space-y-2 mb-4">
                            {booking.cartItems.map((item, idx) => (
                              <li
                                key={idx}
                                className="flex justify-between text-sm"
                              >
                                <span className="text-gray-600 font-medium">
                                  <span className="font-bold text-brand-charcoal">
                                    {item.quantity}x
                                  </span>{' '}
                                  {item.name ||
                                    `Item #${item.id}`}
                                </span>

                                <span className="font-medium text-brand-charcoal">
                                  ₹
                                  {(item.price || 0) *
                                    item.quantity}
                                </span>
                              </li>
                            ))}
                          </ul>

                          <div className="pt-3 border-t border-gray-200 text-sm font-bold text-brand-charcoal flex justify-between">
                            <span>Total</span>

                            <span className="text-brand-gold">
                              ₹
                              {booking.cartItems.reduce(
                                (total, item) =>
                                  total +
                                  ((item.price || 0) *
                                    item.quantity),
                                0
                              )}
                            </span>
                          </div>

                        </div>
                      </div>
                    )}

                </div>

                {/* Actions */}
                <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">

                  <button
                    onClick={() =>
                      handleDelete(booking.id)
                    }
                    className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                  >
                    <Trash2 size={16} /> Cancel Order
                  </button>

                  <button
                    onClick={() =>
                      handleDelete(booking.id)
                    }
                    className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
                  >
                    <CheckCircle2 size={16} /> Complete Order
                  </button>

                </div>

              </motion.div>
            ))}

          </div>
        )}

      </main>
    </div>
  );
}