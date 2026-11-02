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
  CheckCircle2,
  Search,
  CreditCard,
  Wallet,
  IndianRupee,
  ShieldCheck,
  Copy,
  Check,
  Filter
} from 'lucide-react';
import { motion } from 'motion/react';

export default function AdminDashboard() {
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // 'all', 'today', 'paid', 'pending'
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedTxn, setCopiedTxn] = useState(null);

  useEffect(() => {
    const loadBookings = async () => {
      try {
        const loadedBookings = await getStoredBookings();

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
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    window.location.href = "/";
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to update/delete this booking?")) return;
    try {
      await deleteStoredBooking(id);
      setBookings(prev => prev.filter(b => b.id !== id));
    } catch (error) {
      console.error("Failed to delete booking:", error);
      alert("Failed to delete booking.");
    }
  };

  const handleCopyTxn = (txnId) => {
    if (!txnId) return;
    navigator.clipboard.writeText(txnId);
    setCopiedTxn(txnId);
    setTimeout(() => setCopiedTxn(null), 2000);
  };

  // Helper to detect if a booking was paid online
  const isPaidOnline = (booking) => {
    return (
      booking.paymentStatus === 'PAID' ||
      booking.paymentMethod === 'RAZORPAY' ||
      Boolean(booking.transactionId && booking.transactionId.startsWith('pay_'))
    );
  };

  // Helper to get total amount
  const getBookingAmount = (booking) => {
    if (booking.totalAmount && Number(booking.totalAmount) > 0) {
      return Number(booking.totalAmount);
    }
    if (booking.cartItems && booking.cartItems.length > 0) {
      const itemsSum = booking.cartItems.reduce(
        (sum, item) => sum + ((item.price || 0) * (item.quantity || 1)),
        0
      );
      return itemsSum + 40 + 35; // taxes + charges
    }
    return 0;
  };

  // Metrics
  const totalReservations = bookings.length;
  const preorderCount = bookings.filter(b => b.orderPreference === 'preorder').length;
  const totalGuests = bookings.reduce((sum, b) => sum + (Number(b.guests) || 0), 0);
  const paidCount = bookings.filter(isPaidOnline).length;
  const pendingCount = totalReservations - paidCount;

  const totalOnlineRevenue = bookings
    .filter(isPaidOnline)
    .reduce((sum, b) => sum + getBookingAmount(b), 0);

  // Filtered Bookings
  const getFilteredBookings = () => {
    let list = bookings;
    const today = new Date().toISOString().split('T')[0];

    if (filter === 'today') {
      list = list.filter(b => b.date === today);
    } else if (filter === 'paid') {
      list = list.filter(isPaidOnline);
    } else if (filter === 'pending') {
      list = list.filter(b => !isPaidOnline(b));
    }

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase().trim();
      list = list.filter(b =>
        (b.bookingId && b.bookingId.toLowerCase().includes(q)) ||
        (b.fullName && b.fullName.toLowerCase().includes(q)) ||
        (b.phone && b.phone.toLowerCase().includes(q)) ||
        (b.email && b.email.toLowerCase().includes(q)) ||
        (b.transactionId && b.transactionId.toLowerCase().includes(q))
      );
    }

    return list;
  };

  const filteredBookings = getFilteredBookings();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex flex-col items-center justify-center gap-3">
        <div className="w-10 h-10 border-4 border-amber-600/30 border-t-amber-600 rounded-full animate-spin" />
        <p className="text-stone-600 text-sm font-medium">Loading Admin Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7] font-sans">
      {/* Admin Navbar */}
      <nav className="bg-brand-charcoal text-white py-4 px-6 sticky top-0 z-50 shadow-md border-b border-stone-800">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-gold/15 flex items-center justify-center border border-brand-gold/30">
              <UtensilsCrossed className="w-5 h-5 text-brand-gold" />
            </div>
            <div>
              <span className="font-serif text-lg sm:text-xl font-bold tracking-wider block">
                Royal Spice Admin
              </span>
              <span className="text-[10px] text-brand-gold uppercase tracking-widest font-semibold block">
                Live Restaurant Portal
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4 sm:gap-6">
            <Link
              to="/"
              className="text-gray-300 hover:text-white text-sm transition-colors hidden sm:inline-block"
            >
              View Website
            </Link>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
            >
              <LogOut size={15} /> Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Dashboard Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">

        {/* Title & Search / Filter Controls */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-serif text-brand-charcoal font-bold">
              Booking & Payment Management
            </h1>
            <p className="text-gray-500 text-xs sm:text-sm mt-1">
              Real-time monitoring of tables, customer pre-orders, and online payment settlements.
            </p>
          </div>

          {/* Search Box */}
          <div className="w-full lg:w-80 relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by ID, name, phone, txn..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-8 py-2.5 rounded-full bg-white border border-gray-200 text-xs sm:text-sm text-brand-charcoal focus:outline-none focus:border-brand-gold shadow-2xs placeholder:text-gray-400 font-medium transition-all"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-gray-600 font-bold bg-gray-100 rounded-full w-5 h-5 flex items-center justify-center cursor-pointer"
              >
                ×
              </button>
            )}
          </div>
        </div>

        {/* Stats Row (4 Metric Cards) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">

          {/* Card 1: Total Reservations */}
          <div className="bg-white p-5 sm:p-6 rounded-2xl shadow-xs border border-gray-100 flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shrink-0">
              <CalendarDays size={24} />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">
                Total Bookings
              </p>
              <p className="text-2xl font-black text-brand-charcoal font-mono mt-0.5">
                {totalReservations}
              </p>
            </div>
          </div>

          {/* Card 2: Pre-orders */}
          <div className="bg-white p-5 sm:p-6 rounded-2xl shadow-xs border border-gray-100 flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center shrink-0">
              <ShoppingBag size={24} />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">
                Pre-orders
              </p>
              <p className="text-2xl font-black text-brand-charcoal font-mono mt-0.5">
                {preorderCount}
              </p>
            </div>
          </div>

          {/* Card 3: Total Guests */}
          <div className="bg-white p-5 sm:p-6 rounded-2xl shadow-xs border border-gray-100 flex items-center gap-4">
            <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center shrink-0">
              <Users size={24} />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">
                Total Guests
              </p>
              <p className="text-2xl font-black text-brand-charcoal font-mono mt-0.5">
                {totalGuests}
              </p>
            </div>
          </div>

          {/* Card 4: Online Revenue (Verified Razorpay) */}
          <div className="bg-white p-5 sm:p-6 rounded-2xl shadow-xs border border-emerald-100/80 bg-gradient-to-br from-white via-white to-emerald-50/30 flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center shrink-0 border border-emerald-100">
              <Wallet size={24} />
            </div>
            <div>
              <p className="text-xs text-emerald-700 font-bold uppercase tracking-wider flex items-center gap-1">
                Online Revenue
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              </p>
              <p className="text-2xl font-black text-emerald-800 font-mono mt-0.5">
                ₹{totalOnlineRevenue.toLocaleString('en-IN')}
              </p>
              <span className="text-[10px] text-emerald-600 font-medium block">
                {paidCount} paid booking{paidCount === 1 ? '' : 's'}
              </span>
            </div>
          </div>

        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-6 scrollbar-none">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 sm:px-5 py-2 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              filter === 'all'
                ? 'bg-brand-charcoal text-brand-gold shadow-xs'
                : 'bg-white text-gray-600 hover:text-brand-charcoal border border-gray-200'
            }`}
          >
            All Bookings ({totalReservations})
          </button>

          <button
            onClick={() => setFilter('today')}
            className={`px-4 sm:px-5 py-2 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              filter === 'today'
                ? 'bg-brand-charcoal text-brand-gold shadow-xs'
                : 'bg-white text-gray-600 hover:text-brand-charcoal border border-gray-200'
            }`}
          >
            Today's Bookings
          </button>

          <button
            onClick={() => setFilter('paid')}
            className={`px-4 sm:px-5 py-2 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              filter === 'paid'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'bg-white text-emerald-700 hover:bg-emerald-50 border border-emerald-200'
            }`}
          >
            <CheckCircle2 size={13} className="text-emerald-500" />
            Paid Online ({paidCount})
          </button>

          <button
            onClick={() => setFilter('pending')}
            className={`px-4 sm:px-5 py-2 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              filter === 'pending'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-white text-amber-700 hover:bg-amber-50 border border-amber-200'
            }`}
          >
            <Clock size={13} className="text-amber-500" />
            Pay at Counter ({pendingCount})
          </button>
        </div>

        {/* Bookings Grid */}
        {filteredBookings.length === 0 ? (
          <div className="bg-white rounded-3xl border border-gray-100 p-16 text-center shadow-xs">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <CalendarDays className="w-8 h-8 text-gray-300" />
            </div>
            <h3 className="text-lg font-bold text-brand-charcoal mb-1">
              No Bookings Found
            </h3>
            <p className="text-gray-500 text-xs sm:text-sm">
              {searchTerm
                ? `No bookings match your search term "${searchTerm}".`
                : 'There are currently no reservations under this filter.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredBookings.map((booking) => {
              const paid = isPaidOnline(booking);
              const amount = getBookingAmount(booking);

              return (
                <motion.div
                  key={booking.bookingId || booking.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col"
                >
                  {/* Card Header */}
                  <div className="bg-brand-charcoal text-white p-5 flex flex-wrap justify-between items-center gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-brand-gold font-mono font-bold text-sm tracking-wide">
                          {booking.bookingId}
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-400 mt-0.5">
                        Booked: {booking.createdAt ? new Date(booking.createdAt).toLocaleString() : 'Recent'}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Order Type Pill */}
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                          booking.orderPreference === 'preorder'
                            ? 'bg-amber-400/20 text-amber-300 border border-amber-400/30'
                            : 'bg-white/10 text-gray-300'
                        }`}
                      >
                        {booking.orderPreference === 'preorder' ? 'Pre-ordered' : 'Dine-In'}
                      </span>

                      {/* Payment Status Pill */}
                      {paid ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                          <CheckCircle2 size={12} className="text-emerald-400" />
                          Paid Online {amount > 0 ? `(₹${amount.toLocaleString('en-IN')})` : ''}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/40">
                          <Clock size={12} className="text-amber-300" />
                          Pay at Restaurant
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-6 grow flex flex-col">

                    {/* Customer & Reservation Details */}
                    <div className="grid grid-cols-2 gap-y-4 gap-x-4 mb-5">
                      <div>
                        <p className="text-[10px] text-gray-400 uppercase font-black tracking-wider mb-1">
                          Customer
                        </p>
                        <p className="font-bold text-brand-charcoal text-sm sm:text-base">
                          {booking.fullName}
                        </p>
                        <div className="flex items-center gap-1.5 text-xs text-gray-600 mt-1 font-medium">
                          <Phone size={13} className="text-brand-gold shrink-0" />
                          <span>{booking.phone}</span>
                        </div>
                        {booking.email && (
                          <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-0.5 font-medium truncate">
                            <Mail size={13} className="text-brand-gold shrink-0" />
                            <span className="truncate">{booking.email}</span>
                          </div>
                        )}
                      </div>

                      <div>
                        <p className="text-[10px] text-gray-400 uppercase font-black tracking-wider mb-1">
                          Reservation Slot
                        </p>
                        <div className="flex items-center gap-1.5 text-brand-charcoal font-semibold text-xs mt-1">
                          <CalendarDays size={14} className="text-brand-gold" />
                          <span>{booking.date}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-brand-charcoal font-semibold text-xs mt-1">
                          <Clock size={14} className="text-brand-gold" />
                          <span>{booking.time}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-brand-charcoal font-semibold text-xs mt-1">
                          <Users size={14} className="text-brand-gold" />
                          <span>{booking.guests} Guests</span>
                        </div>
                      </div>
                    </div>

                    {/* Table Preference */}
                    {booking.tablePreference && booking.tablePreference !== 'No Preference' && (
                      <div className="mb-4 bg-gray-50 p-3 rounded-xl border border-gray-100 flex items-start gap-2.5">
                        <CheckCircle size={16} className="text-gray-400 shrink-0 mt-0.5" />
                        <div>
                          <p className="text-[10px] text-gray-500 uppercase font-black tracking-wider">
                            Table Assignment
                          </p>
                          <p className="text-xs font-semibold text-brand-charcoal mt-0.5">
                            {booking.tablePreference}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Special Request */}
                    {booking.specialRequest && (
                      <div className="mb-4 bg-amber-50/70 p-3 rounded-xl border border-amber-200/60 flex items-start gap-2.5">
                        <FileText size={16} className="text-amber-600 shrink-0 mt-0.5" />
                        <div>
                          <p className="text-[10px] text-amber-700 uppercase font-black tracking-wider">
                            Special Request
                          </p>
                          <p className="text-xs text-amber-900 italic mt-0.5">
                            "{booking.specialRequest}"
                          </p>
                        </div>
                      </div>
                    )}

                    {/* PAYMENT OVERVIEW BANNER */}
                    <div className="mt-auto pt-2">
                      {paid ? (
                        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
                              <CheckCircle2 size={16} />
                            </div>
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span className="text-xs font-black uppercase tracking-wider text-emerald-800">
                                  Paid Online via Razorpay
                                </span>
                                <span className="text-[9px] bg-emerald-200/80 text-emerald-800 px-1.5 py-0.5 rounded-full font-bold">
                                  Verified
                                </span>
                              </div>
                              {booking.transactionId && (
                                <div className="flex items-center gap-1.5 mt-0.5">
                                  <span className="text-[11px] font-mono text-emerald-700 font-semibold">
                                    TXN: {booking.transactionId}
                                  </span>
                                  <button
                                    onClick={() => handleCopyTxn(booking.transactionId)}
                                    title="Copy transaction ID"
                                    className="text-emerald-700 hover:text-emerald-900 cursor-pointer"
                                  >
                                    {copiedTxn === booking.transactionId ? (
                                      <Check size={12} className="text-emerald-600" />
                                    ) : (
                                      <Copy size={12} />
                                    )}
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="sm:text-right border-t sm:border-t-0 border-emerald-200/60 pt-1.5 sm:pt-0">
                            <span className="text-[9px] uppercase font-bold text-emerald-600 block">
                              Total Paid
                            </span>
                            <span className="text-base font-black text-emerald-800 font-mono">
                              ₹{amount.toLocaleString('en-IN')}
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200 text-amber-900 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-amber-500 text-white flex items-center justify-center shrink-0">
                              <Clock size={16} />
                            </div>
                            <div>
                              <span className="text-xs font-black uppercase tracking-wider text-amber-800 block">
                                Pay at Restaurant (Cash / Card)
                              </span>
                              <p className="text-[11px] text-amber-700 mt-0.5">
                                Payment pending · Customer will settle bill after dining.
                              </p>
                            </div>
                          </div>
                          <div className="sm:text-right border-t sm:border-t-0 border-amber-200/60 pt-1.5 sm:pt-0">
                            <span className="text-[9px] uppercase font-bold text-amber-600 block">
                              Expected Bill
                            </span>
                            <span className="text-base font-black text-amber-800 font-mono">
                              {amount > 0 ? `₹${amount.toLocaleString('en-IN')}` : 'À la carte'}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Pre-order Details Accordion / List */}
                    {booking.orderPreference === 'preorder' &&
                      booking.cartItems &&
                      booking.cartItems.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-gray-100">
                          <div className="flex items-center gap-2 mb-3">
                            <ShoppingBag size={15} className="text-brand-charcoal" />
                            <h4 className="font-bold text-xs uppercase tracking-wider text-brand-charcoal">
                              Pre-ordered Items ({booking.cartItems.length})
                            </h4>
                          </div>

                          <div className="bg-gray-50 rounded-xl p-3.5 border border-gray-200">
                            <ul className="space-y-1.5 mb-3">
                              {booking.cartItems.map((item, idx) => (
                                <li key={idx} className="flex justify-between text-xs">
                                  <span className="text-gray-700 font-medium">
                                    <span className="font-bold text-brand-charcoal">{item.quantity}x</span>{' '}
                                    {item.name || `Item #${item.id || item.menuItemId}`}
                                  </span>
                                  <span className="font-bold text-brand-charcoal font-mono">
                                    ₹{((item.price || 0) * (item.quantity || 1)).toLocaleString('en-IN')}
                                  </span>
                                </li>
                              ))}
                            </ul>

                            {(() => {
                              const subtotal = booking.cartItems.reduce(
                                (tot, it) => tot + ((it.price || 0) * (it.quantity || 1)),
                                0
                              );
                              const gstCharges = 40;
                              const restaurantCharges = 35;
                              const grandTotal = amount > 0 ? amount : subtotal + gstCharges + restaurantCharges;

                              return (
                                <div className="pt-2 border-t border-gray-200 space-y-1 text-[11px] text-gray-500">
                                  <div className="flex justify-between">
                                    <span>Items Subtotal:</span>
                                    <span className="font-semibold text-brand-charcoal font-mono">
                                      ₹{subtotal.toLocaleString('en-IN')}
                                    </span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span>GST & Govt Taxes (5%):</span>
                                    <span className="font-semibold text-brand-charcoal font-mono">
                                      +₹{gstCharges}
                                    </span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span>Restaurant Charges & Service:</span>
                                    <span className="font-semibold text-brand-charcoal font-mono">
                                      +₹{restaurantCharges}
                                    </span>
                                  </div>
                                  <div className="pt-1.5 border-t border-dashed border-gray-300 flex justify-between items-baseline text-xs font-black text-brand-charcoal">
                                    <span>Total Bill Amount:</span>
                                    <span className={`text-sm font-mono font-black ${paid ? 'text-emerald-700' : 'text-brand-gold'}`}>
                                      ₹{grandTotal.toLocaleString('en-IN')}
                                    </span>
                                  </div>
                                </div>
                              );
                            })()}
                          </div>
                        </div>
                      )}

                  </div>

                  {/* Actions */}
                  <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
                    <button
                      onClick={() => handleDelete(booking.id)}
                      className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors cursor-pointer"
                    >
                      <Trash2 size={14} /> Cancel Booking
                    </button>

                    <button
                      onClick={() => handleDelete(booking.id)}
                      className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors cursor-pointer"
                    >
                      <CheckCircle2 size={14} /> Complete Order
                    </button>
                  </div>

                </motion.div>
              );
            })}
          </div>
        )}

      </main>
    </div>
  );
}