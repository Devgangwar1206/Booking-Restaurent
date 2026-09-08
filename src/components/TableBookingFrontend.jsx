import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Users, User, Trash2, CheckCircle2 } from 'lucide-react';



export default function TableBookingFrontend() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  
  // Form State
  const [customerName, setCustomerName] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [guests, setGuests] = useState('2');



  // 1. READ: Fetch Bookings
  const fetchBookings = async () => {
    // --- Spring Boot Integration Code ---
    try {
      const response = await fetch("http://localhost:8888/api/readall");
      const data = await response.json();
      setBookings(data);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // 2. CREATE: Add new booking
  const handleBookTable = async (e) => {
    e.preventDefault();
    setLoading(true);

    const newBooking = {
      customerName,
      date,
      time,
      guests: parseInt(guests),
    };

    // --- Spring Boot Integration Code ---
    
    try {
      const response = await fetch("http://localhost:8888/api/create", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newBooking)
      });
      if (response.ok) {
        setMessage('Table booked successfully!');
        fetchBookings(); // Refresh list
        // clear form
      }
    } catch (error) {
      console.error("Error creating booking:", error);
    }
    

    // // Simulated Backend for Preview
    // setTimeout(() => {
    //   setBookings([...bookings, { ...newBooking, id: Date.now() }]);
    //   setMessage('Table booked successfully!');
    //   setCustomerName('');
    //   setDate('');
    //   setTime('');
    //   setGuests('2');
    //   setLoading(false);
      
    //   setTimeout(() => setMessage(''), 3000);
    // }, 600);
  };

  // 3. DELETE: Cancel Booking
  const handleCancelBooking = async (id) => {
    // --- Spring Boot Integration Code ---
    
    try {
      await fetch(`${"http://localhost:8888/api/delete"}/${id}`, { method: 'DELETE' });
      fetchBookings(); // Refresh list
    } catch (error) {
      console.error("Error deleting booking:", error);
    }
    

    // Simulated Backend for Preview
    setBookings(bookings.filter(b => b.id !== id));
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-slate-900 tracking-tight">Restaurant Reservations</h1>
          <p className="mt-2 text-lg text-slate-600">Book your table quickly and easily.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Booking Form */}
          <div className="md:col-span-1 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h2 className="text-xl font-semibold text-slate-800 mb-4">New Booking</h2>
            
            {message && (
              <div className="mb-4 p-3 bg-emerald-50 text-emerald-700 rounded-lg flex items-center gap-2 text-sm">
                <CheckCircle2 className="w-4 h-4" />
                {message}
              </div>
            )}

            <form onSubmit={handleBookTable} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-4 w-4 text-slate-400" />
                  </div>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all"
                    placeholder="Enter your name"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Date</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar className="h-4 w-4 text-slate-400" />
                  </div>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Time</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Clock className="h-4 w-4 text-slate-400" />
                  </div>
                  <input
                    type="time"
                    required
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Guests</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Users className="h-4 w-4 text-slate-400" />
                  </div>
                  <select
                    value={guests}
                    onChange={(e) => setGuests(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                      <option key={num} value={num}>{num} {num === 1 ? 'Person' : 'People'}</option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors disabled:opacity-50"
              >
                {loading ? 'Booking...' : 'Book Table'}
              </button>
            </form>
          </div>

          {/* Bookings List */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                <h2 className="text-xl font-semibold text-slate-800">Upcoming Reservations</h2>
                <span className="bg-indigo-50 text-indigo-700 py-1 px-3 rounded-full text-xs font-semibold">
                  {bookings.length} Total
                </span>
              </div>
              
              {bookings.length === 0 ? (
                <div className="p-8 text-center text-slate-500 flex flex-col items-center">
                  <Calendar className="w-12 h-12 text-slate-200 mb-3" />
                  <p>No tables booked yet.</p>
                  <p className="text-sm mt-1">Make a reservation to see it here.</p>
                </div>
              ) : (
                <ul className="divide-y divide-slate-100">
                  {bookings.map((booking) => (
                    <li key={booking.id} className="p-6 hover:bg-slate-50 transition-colors flex items-center justify-between group">
                      <div className="flex flex-col gap-1">
                        <span className="font-semibold text-slate-900 text-lg">{booking.customerName}</span>
                        <div className="flex items-center gap-4 text-sm text-slate-500">
                          <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {booking.date}</span>
                          <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {booking.time}</span>
                          <span className="flex items-center gap-1"><Users className="w-4 h-4" /> {booking.guests}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleCancelBooking(booking.id)}
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                        title="Cancel Booking"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
