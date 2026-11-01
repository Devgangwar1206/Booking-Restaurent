'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Calendar,
  Clock,
  Users,
  User,
  Phone,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  QrCode,
  Info,
  Check,
  Copy,
  RefreshCw,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  Utensils,
  ChevronLeft,
} from 'lucide-react';
import FloorPlan from './FloorPlan';
import ErrorBoundary from './ErrorBoundary';
import HoldTimerBadge from './HoldTimerBadge';
import CuteHoldClock from './CuteHoldClock';
import InfoLegendModal from './InfoLegendModal';
import OrderCartReviewPage from './OrderCartReviewPage';
import PaymentPortalModal from './PaymentPortalModal';
import API_URL from '../api/apiConfig';
import { RESTAURANT_TABLES } from '../lib/reservation-db';
import { useCart } from '../context/CartContext';
import { useTableHold } from '../context/TableHoldContext';
import { menuData } from '../data/menuData';

const BASE_API = API_URL ? API_URL.replace(/\/$/, '') : '';

export default function TableReservationWidget({
  formData,
  setFormData,
  onClose = null,
}) {
  // Global Hold & Session Context
  const {
    sessionId,
    activeHold,
    setActiveHold,
    clearActiveHold,
    selectedTable,
    setSelectedTable,
    bookingStep: currentStep,
    setBookingStep: setCurrentStep,
  } = useTableHold();

  // Tables & Availability State
  const [tables, setTables] = useState([]);
  const [isLoadingAvailability, setIsLoadingAvailability] = useState(false);
  const [availabilityError, setAvailabilityError] = useState(null);

  // Redis Hold State
  const [isAcquiringHold, setIsAcquiringHold] = useState(false);
  const [holdError, setHoldError] = useState(null);
  const [feedbackMessage, setFeedbackMessage] = useState(null);

  // Customer Website Cart Context Binding
  const {
    cartItems: rawCartItems,
    addToCart: addWebsiteToCart,
    updateQuantity: updateWebsiteQuantity,
    clearCart: clearWebsiteCart,
  } = useCart();

  // Map CartContext structure { menuItem, quantity } into flat items for review and booking
  const cartItems = useMemo(() => {
    return (rawCartItems || []).map((entry) => ({
      id: entry.menuItem.id,
      name: entry.menuItem.name,
      category: entry.menuItem.category,
      price: entry.menuItem.price,
      quantity: entry.quantity,
      isVeg: entry.menuItem.isVeg ?? true,
      image: entry.menuItem.image,
    }));
  }, [rawCartItems]);

  const handleUpdateCartQuantity = (id, delta) => {
    const existing = (rawCartItems || []).find((entry) => entry.menuItem.id === id);
    if (existing) {
      const newQty = existing.quantity + delta;
      updateWebsiteQuantity(id, newQty);
    }
  };

  const handleAddQuickDish = () => {
    const existingIds = new Set((rawCartItems || []).map((entry) => entry.menuItem.id));
    const nextDish = menuData.find((dish) => !existingIds.has(dish.id)) || menuData[0];
    if (nextDish) {
      addWebsiteToCart(nextDish);
    }
  };

  const [currentBill, setCurrentBill] = useState(null);
  const [isPaymentPortalOpen, setIsPaymentPortalOpen] = useState(false);

  // Confirmation State
  const [isConfirming, setIsConfirming] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState(null);
  const [confirmError, setConfirmError] = useState(null);
  const [copied, setCopied] = useState(false);

  // Info Modal
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);

  // Dynamic Quick Days (Today + next 4 days)
  const quickDays = useMemo(() => {
    const list = [];
    const now = new Date();
    for (let i = 0; i < 5; i++) {
      const d = new Date(now);
      d.setDate(now.getDate() + i);
      const iso = d.toISOString().split('T')[0];
      const label =
        i === 0
          ? 'Today'
          : i === 1
          ? 'Tomorrow'
          : d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
      list.push({ iso, label });
    }
    return list;
  }, []);

  // Ensure current date defaults to today if unset or stale
  useEffect(() => {
    const todayIso = new Date().toISOString().split('T')[0];
    if (!formData.date || formData.date < todayIso) {
      setFormData((prev) => ({ ...prev, date: todayIso }));
    }
  }, [formData.date, setFormData]);

  const quickGuestPills = [1, 2, 4, 6, 8, 10, 12, 16];
  const timeSlots = [
    '11:30 am',
    '11:45 am',
    '12:30 pm',
    '1:15 pm',
    '6:00 pm',
    '6:30 pm',
    '7:15 pm',
    '8:00 pm',
  ];

  // Fetch Live Table Availability from Backend
  const refreshAvailability = useCallback(
    async (bypassCache = false) => {
      try {
        setIsLoadingAvailability(true);
        setAvailabilityError(null);
        const url = `${BASE_API}/api/availability?date=${formData.date}&timeSlot=${encodeURIComponent(
          formData.timeSlot
        )}&guestCount=${formData.guestCount}&sessionId=${sessionId || ''}${
          bypassCache ? '&refresh=true' : ''
        }`;
        const res = await fetch(url);
        const data = await res.json();

        if (data.success && data.tables) {
          setTables(data.tables);
          setSelectedTable((prev) => {
            if (!prev) {
              const available = data.tables.find((t) => t.status === 'AVAILABLE');
              return available || null;
            }
            const updated = data.tables.find((t) => t.id === prev.id);
            return updated || prev;
          });
        } else {
          setAvailabilityError(data.error || 'Failed to load table availability');
        }
      } catch (err) {
        setAvailabilityError(err.message || 'Error connecting to availability service');
        setTables((prev) => (prev.length > 0 ? prev : RESTAURANT_TABLES.map((t) => ({ ...t, status: 'AVAILABLE', suitableForGuests: true }))));
      } finally {
        setIsLoadingAvailability(false);
      }
    },
    [formData.date, formData.timeSlot, formData.guestCount, sessionId]
  );

  useEffect(() => {
    let ignore = false;
    if (!sessionId) return;

    const url = `${BASE_API}/api/availability?date=${formData.date}&timeSlot=${encodeURIComponent(
      formData.timeSlot
    )}&guestCount=${formData.guestCount}&sessionId=${sessionId}`;

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        if (!ignore && data.success && data.tables) {
          setTables(data.tables);
          setSelectedTable((prev) => {
            if (prev) {
              const updated = data.tables.find((t) => t.id === prev.id);
              if (updated && (updated.status === 'AVAILABLE' || updated.heldByCurrentSession)) {
                return updated;
              }
            }
            const available = data.tables.find((t) => t.status === 'AVAILABLE');
            return available || null;
          });
        }
      })
      .catch((err) => {
        if (!ignore) {
          setAvailabilityError(err.message || 'Failed to load table availability');
          setTables((prev) => (prev.length > 0 ? prev : RESTAURANT_TABLES.map((t) => ({ ...t, status: 'AVAILABLE', suitableForGuests: true }))));
        }
      });

    return () => {
      ignore = true;
    };
  }, [sessionId, formData.date, formData.timeSlot, formData.guestCount]);

  // Live polling every 3.5 seconds + on window focus so multi-tab updates reflect in real-time
  useEffect(() => {
    if (!sessionId) return;
    const interval = setInterval(() => {
      refreshAvailability(false);
    }, 3500);

    const onFocus = () => {
      refreshAvailability(true);
    };
    window.addEventListener('focus', onFocus);

    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', onFocus);
    };
  }, [sessionId, refreshAvailability]);

  // Handle table selection on floor plan (local selection without locking Redis immediately)
  const handleSelectTable = (table) => {
    setHoldError(null);
    setConfirmError(null);

    if (table.status === 'RESERVED') {
      setHoldError(`Table ${table.tableNumber} is already booked for this time. Please pick another table.`);
      return;
    }
    if (table.status === 'HELD' && !table.heldByCurrentSession) {
      setHoldError(`Table ${table.tableNumber} is temporarily held by another guest. Please select another table.`);
      return;
    }

    // Do NOT reduce the user's chosen party size! Accommodate large groups (8, 10, etc.)
    if (formData.guestCount > table.capacity) {
      setFeedbackMessage(
        `Table ${table.tableNumber} selected. We will arrange adjoining seating & extra chairs for your party of ${formData.guestCount}.`
      );
    } else {
      setFeedbackMessage(null);
    }

    setSelectedTable(table);
  };

  // Direct Guest Count change (typing in input or stepper)
  const handleGuestCountChange = (val) => {
    const count = Math.max(1, Math.min(25, Number(val) || 1));
    setFormData((prev) => ({ ...prev, guestCount: count }));
    if (selectedTable && count > selectedTable.capacity) {
      setFeedbackMessage(
        `Large party (${count} guests): Table ${selectedTable.tableNumber} will have extra seating arranged.`
      );
    } else {
      setFeedbackMessage(null);
    }
  };

  // Reset all test reservations endpoint
  const handleResetTestReservations = async () => {
    try {
      setIsLoadingAvailability(true);
      await fetch(`${BASE_API}/api/reservations?reset=true`, { method: 'DELETE' });
      setHoldError(null);
      setConfirmError(null);
      setFeedbackMessage('All reservations have been reset. All 10 tables are available!');
      await refreshAvailability(true);
    } catch (err) {
      setHoldError('Failed to reset reservations');
    } finally {
      setIsLoadingAvailability(false);
    }
  };

  // Callback when the 5-minute hold timer expires
  const handleHoldExpire = useCallback(() => {
    clearActiveHold();
    setHoldError('Your 5-minute table hold timer has expired. The table has been released for other guests.');
    setCurrentStep('SELECT_TABLE');
    refreshAvailability(true);
  }, [clearActiveHold, setCurrentStep, refreshAvailability]);

  // Step 1 -> Step 2: Validate selection, ACQUIRE 5-MINUTE REDIS HOLD, & open Cart Review Page
  const handleProceedToCartReview = async () => {
    let table = selectedTable;
    if (!table) {
      table = tables.find((t) => t.status === 'AVAILABLE') || tables[0];
      if (table) {
        setSelectedTable(table);
      } else {
        setHoldError('Please tap an available table on the floor plan.');
        return;
      }
    }

    if (table.status === 'RESERVED') {
      setHoldError(`Table ${table.tableNumber} is already booked. Please choose another table.`);
      return;
    }
    if (table.status === 'HELD' && !table.heldByCurrentSession) {
      setHoldError(`Table ${table.tableNumber} is temporarily on hold by another guest. Please select another table.`);
      return;
    }

    const customerName = formData.customerName?.trim() || 'Alex Morgan';
    const customerPhone = formData.customerPhone?.trim() || '+91 98765 43210';
    setFormData((prev) => ({
      ...prev,
      customerName,
      customerPhone,
    }));

    // Lock the table in Redis for 5 minutes
    setIsAcquiringHold(true);
    setHoldError(null);
    setConfirmError(null);

    try {
      const res = await fetch(`${BASE_API}/api/holds`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tableId: table.id,
          date: formData.date,
          timeSlot: formData.timeSlot,
          guestCount: formData.guestCount,
          sessionId: sessionId,
          customerName: customerName,
        }),
      });

      const data = await res.json();

      if (data.success && data.hold) {
        const enrichedHold = {
          ...data.hold,
          tableNumber: table.tableNumber,
          tableName: table.name,
        };
        setActiveHold(enrichedHold);
        setCurrentStep('CART_REVIEW');
        if (typeof window !== 'undefined') {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      } else {
        setHoldError(
          data.error || `Table ${table.tableNumber} could not be held. Another guest may have just selected it.`
        );
        refreshAvailability(true);
      }
    } catch (err) {
      console.error('Error acquiring hold:', err);
      setHoldError('Could not connect to Redis hold service. Please try again.');
      refreshAvailability(true);
    } finally {
      setIsAcquiringHold(false);
    }
  };

  // Finalize reservation (called by Pay at Restaurant OR Pay Now after payment)
  const handleFinalizeBooking = async ({
    paymentStatus = 'PAY_AT_RESTAURANT',
    paymentMethod = 'PAY_AT_RESTAURANT',
    transactionId = undefined,
    billBreakdown = null,
    cartItemsData = cartItems,
  }) => {
    setIsConfirming(true);
    setConfirmError(null);
    setHoldError(null);

    try {
      const res = await fetch(`${BASE_API}/api/reservations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          holdToken: activeHold?.holdToken,
          tableId: selectedTable.id,
          date: formData.date,
          timeSlot: formData.timeSlot,
          guestCount: formData.guestCount,
          customerName: formData.customerName,
          customerEmail: formData.customerEmail || 'guest@example.com',
          customerPhone: formData.customerPhone,
          specialRequests: formData.specialRequests || '',
          sessionId: sessionId,
          paymentStatus,
          paymentMethod,
          transactionId,
          cartItems: cartItemsData,
          billBreakdown,
        }),
      });

      const data = await res.json();
      const booking = data.booking || data.reservation;

      if (data.success && booking) {
        setConfirmedBooking(booking);
        setCurrentBill(billBreakdown);
        setCurrentStep('CONFIRMED');
        setIsPaymentPortalOpen(false);
        clearActiveHold();
        clearWebsiteCart();
        refreshAvailability(true);

        import('canvas-confetti')
          .then((mod) => {
            const fireConfetti = mod.default || mod;
            fireConfetti({
              particleCount: 90,
              spread: 75,
              origin: { y: 0.6 },
              colors: ['#e11d48', '#f59e0b', '#10b981', '#3b82f6'],
            });
          })
          .catch(() => {});
      } else {
        setConfirmError(data.error || 'Failed to confirm reservation.');
      }
    } catch (err) {
      setConfirmError(err.message || 'Error processing reservation confirmation');
    } finally {
      setIsConfirming(false);
    }
  };

  // Triggered when user clicks "Pay at Restaurant" on OrderCartReviewPage
  const handlePayAtRestaurant = (billData) => {
    handleFinalizeBooking({
      paymentStatus: 'PAY_AT_RESTAURANT',
      paymentMethod: 'PAY_AT_RESTAURANT',
      billBreakdown: billData,
      cartItemsData: billData.cartItems,
    });
  };

  // Triggered when user clicks "Pay Now" on OrderCartReviewPage -> Opens Payment Portal
  const handleOpenPayNow = (billData) => {
    setCurrentBill(billData);
    setIsPaymentPortalOpen(true);
  };

  // Triggered when user successfully completes payment in the modal
  const handlePaymentPortalSuccess = ({ paymentMethod, transactionId }) => {
    handleFinalizeBooking({
      paymentStatus: 'PAID',
      paymentMethod,
      transactionId,
      billBreakdown: currentBill,
      cartItemsData: currentBill?.cartItems || cartItems,
    });
  };

  const handleReset = () => {
    setConfirmedBooking(null);
    setCurrentStep('SELECT_TABLE');
    setActiveHold(null);
    refreshAvailability(true);
  };

  const handleCopyPass = () => {
    if (confirmedBooking) {
      const text = `Reservation Confirmed #${confirmedBooking.bookingReference} at Royal Spice's Dining - Table ${selectedTable?.tableNumber} for ${formData.guestCount} guests on ${formData.date} at ${formData.timeSlot}. Payment: ${confirmedBooking.paymentStatus || 'PAY_AT_RESTAURANT'}.`;
      navigator.clipboard?.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // =========================================================================
  // STEP 2: Render Intermediate Cart & Bill Review Page
  // =========================================================================
  if (currentStep === 'CART_REVIEW') {
    return (
      <div className="w-full min-h-screen flex flex-col bg-stone-50 text-stone-900 no-scrollbar overflow-x-hidden">
        <OrderCartReviewPage
          selectedTable={selectedTable}
          formData={formData}
          cartItems={cartItems}
          onUpdateQuantity={handleUpdateCartQuantity}
          onAddQuickItem={handleAddQuickDish}
          onBack={() => setCurrentStep('SELECT_TABLE')}
          onPayAtRestaurant={handlePayAtRestaurant}
          onPayNow={handleOpenPayNow}
          isSubmitting={isConfirming}
        />

        {/* Realistic Payment Portal Modal */}
        <PaymentPortalModal
          isOpen={isPaymentPortalOpen}
          onClose={() => setIsPaymentPortalOpen(false)}
          totalAmount={currentBill ? currentBill.total : 0}
          bookingReference={`BON-${selectedTable?.tableNumber || 'TAB'}`}
          onPaymentSuccess={handlePaymentPortalSuccess}
        />
      </div>
    );
  }

  // =========================================================================
  // STEP 3: Render Confirmed Table Pass (Receipt + QR Code + Payment Status)
  // =========================================================================
  if (currentStep === 'CONFIRMED' && confirmedBooking) {
    const isPaidOnline = confirmedBooking.paymentStatus === 'PAID';
    const totalAmount = currentBill?.total || 0;

    return (
      <div className="w-full min-h-screen flex flex-col items-center justify-center p-3 sm:p-6 bg-stone-50/95 text-stone-900">
        <div className="w-full max-w-lg bg-white border border-stone-200/90 rounded-3xl p-5 sm:p-7 text-center shadow-2xl space-y-4 my-auto">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto shadow-xs">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Table Confirmed & Locked</span>
            </div>
            <h2 className="text-2xl font-black text-stone-900 mt-2">
              You&apos;re All Set, {confirmedBooking.customerName}!
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              Your table is secured in our real-time system with your order pre-registered.
            </p>
          </div>

          {/* Reference & QR Box */}
          <div className="p-4 bg-stone-50 border border-stone-200/90 rounded-2xl flex items-center justify-between text-left">
            <div>
              <span className="text-[10px] uppercase font-bold text-amber-700">
                Booking Reference
              </span>
              <p className="text-xl font-mono font-bold text-stone-900">
                {confirmedBooking.bookingReference}
              </p>
              <div className="mt-1 flex items-center gap-1.5">
                {totalAmount > 0 ? (
                  isPaidOnline ? (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 border border-emerald-200">
                      PAID ONLINE (₹{totalAmount.toLocaleString('en-IN')})
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-100 text-blue-800 border border-blue-200">
                      PAY AT RESTAURANT (₹{totalAmount.toLocaleString('en-IN')})
                    </span>
                  )
                ) : (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 border border-emerald-200">
                    TABLE RESERVED (₹0 DUE)
                  </span>
                )}
              </div>
            </div>
            <div className="p-2 bg-white rounded-xl shadow-xs border border-stone-200">
              <QrCode className="w-8 h-8 text-stone-800" />
            </div>
          </div>

          {/* Details Table */}
          <div className="space-y-2 text-xs border-t border-stone-100 pt-3 text-left">
            <div className="flex justify-between py-0.5">
              <span className="text-stone-500">Reserved Table:</span>
              <span className="font-bold text-rose-600 font-mono">
                {selectedTable?.tableNumber} ({selectedTable?.name})
              </span>
            </div>
            <div className="flex justify-between py-0.5">
              <span className="text-stone-500">Date & Time:</span>
              <span className="font-bold text-stone-800">{confirmedBooking.date} · {confirmedBooking.timeSlot}</span>
            </div>
            <div className="flex justify-between py-0.5">
              <span className="text-stone-500">Party Size:</span>
              <span className="font-bold text-stone-800">
                {confirmedBooking.guestCount} Guests {confirmedBooking.largePartyArrangement && '(Joined Seating)'}
              </span>
            </div>
            <div className="flex justify-between py-0.5">
              <span className="text-stone-500">Contact Number:</span>
              <span className="font-bold text-stone-800">{confirmedBooking.customerPhone}</span>
            </div>
            <div className="flex justify-between py-0.5">
              <span className="text-stone-500">Pre-ordered Food:</span>
              <span className="font-bold text-stone-800">
                {confirmedBooking.cartItems && confirmedBooking.cartItems.length > 0
                  ? `${confirmedBooking.cartItems.length} items (₹${totalAmount})`
                  : 'Order at Restaurant Table'}
              </span>
            </div>
            {confirmedBooking.cartItems && confirmedBooking.cartItems.length > 0 && (
              <div className="pt-1 flex flex-wrap gap-1">
                {confirmedBooking.cartItems.map((it, idx) => (
                  <span key={it.id || idx} className="text-[10px] bg-stone-100 text-stone-700 px-2 py-0.5 rounded-md font-medium">
                    {it.quantity}x {it.name}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 pt-2">
            <button
              type="button"
              onClick={handleCopyPass}
              className="flex-1 py-3 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs flex items-center justify-center gap-1.5 border border-stone-200 transition-all cursor-pointer"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied' : 'Copy Pass'}</span>
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="flex-1 py-3 rounded-xl bg-gradient-to-r from-rose-600 to-amber-500 hover:from-rose-500 hover:to-amber-400 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Book Another Table</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // STEP 1: Main Floor Plan & Controls
  // =========================================================================
  return (
    <div className="w-full min-h-screen flex flex-col bg-white text-stone-900 pb-28 sm:pb-24">
      {/* Top Header Bar */}
      <div className="py-3 px-4 sm:px-6 border-b border-stone-200/90 bg-white sticky top-0 z-20 flex items-center justify-between shadow-2xs">
        <div className="flex items-center gap-2.5">
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full flex items-center justify-center text-stone-600 hover:text-stone-900 hover:bg-stone-100 border border-stone-200 transition-colors cursor-pointer"
              title="Return to main page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          )}
          <div>
            <h2 className="text-base sm:text-lg font-black text-stone-900 tracking-tight flex items-center gap-2 leading-none">
              <span>Royal Spice&apos;s Table Reservation</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </h2>
            <p className="text-xs text-stone-500 font-medium mt-1">
              Pick date, party & tap your table on the floor plan
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {activeHold && (
            <HoldTimerBadge
              expiresAt={activeHold.expiresAt}
              onExpire={() => {
                setActiveHold(null);
                refreshAvailability(true);
              }}
            />
          )}

          {/* Quick Refresh Tables Button */}
          <button
            type="button"
            onClick={() => refreshAvailability(true)}
            className="w-8 h-8 rounded-full flex items-center justify-center text-stone-600 hover:text-stone-900 hover:bg-stone-100 border border-stone-200 transition-colors cursor-pointer"
            title="Refresh Table Availability"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoadingAvailability ? 'animate-spin text-rose-600' : ''}`} />
          </button>

          <button
            type="button"
            onClick={() => setIsInfoModalOpen(true)}
            className="w-8 h-8 rounded-full flex items-center justify-center text-stone-600 hover:text-stone-900 hover:bg-stone-100 border border-stone-200 transition-colors cursor-pointer"
            title="Floor Plan Guide"
          >
            <Info className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Unified Workspace */}
      <div className="flex-1 w-full max-w-7xl mx-auto p-3 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Column: Date, Party (Input + Steppers + Pills), Time & Contact */}
        <div className="lg:col-span-5 space-y-4">
          {/* Quick Date, Party & Time Card */}
          <div className="space-y-4 bg-white border border-stone-200 p-4 sm:p-5 rounded-3xl shadow-xs">
            {/* 1. Date Selector */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-extrabold text-stone-800 flex items-center gap-1.5 text-xs uppercase tracking-wider">
                  <Calendar className="w-4 h-4 text-rose-600" />
                  Select Date
                </span>
                <input
                  type="date"
                  value={formData.date}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setFormData((prev) => ({ ...prev, date: e.target.value }))}
                  className="text-xs font-semibold text-rose-700 bg-rose-50/60 border border-rose-200 rounded-lg px-2.5 py-1 cursor-pointer focus:outline-none"
                />
              </div>
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
                {quickDays.map((d) => {
                  const isSelected = formData.date === d.iso;
                  return (
                    <button
                      key={d.iso}
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, date: d.iso }))}
                      className={`flex-1 py-2 px-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap border ${
                        isSelected
                          ? 'bg-rose-600 text-white border-rose-500 shadow-xs'
                          : 'bg-stone-50 hover:bg-stone-100 text-stone-700 border-stone-200'
                      }`}
                    >
                      {d.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Party Size (Direct Input + Stepper + Quick Pills) */}
            <div className="space-y-2.5 pt-3 border-t border-stone-100">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-extrabold text-stone-800 flex items-center gap-1.5 text-xs uppercase tracking-wider">
                    <Users className="w-4 h-4 text-rose-600" />
                    Party Size
                  </span>
                  <p className="text-[11px] text-stone-500 font-medium">
                    Type any number (e.g. 8, 10, 12) or use pills
                  </p>
                </div>

                {/* Stepper + Direct Number Input */}
                <div className="flex items-center gap-1.5 bg-stone-50 border-2 border-stone-300 hover:border-rose-400 rounded-2xl px-2 py-1 shadow-2xs transition-colors">
                  <button
                    type="button"
                    onClick={() => handleGuestCountChange(formData.guestCount - 1)}
                    className="w-7 h-7 rounded-xl bg-white hover:bg-stone-200 border border-stone-200 flex items-center justify-center text-stone-700 font-bold transition-colors cursor-pointer shadow-2xs"
                    title="Decrease guests"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>

                  <input
                    type="number"
                    min="1"
                    max="25"
                    value={formData.guestCount}
                    onChange={(e) => handleGuestCountChange(e.target.value)}
                    className="w-12 text-center text-base font-black text-rose-600 bg-transparent focus:outline-none font-mono"
                    title="Type any custom guest count"
                  />
                  <span className="text-xs text-stone-500 font-bold pr-1">Guests</span>

                  <button
                    type="button"
                    onClick={() => handleGuestCountChange(formData.guestCount + 1)}
                    className="w-7 h-7 rounded-xl bg-white hover:bg-stone-200 border border-stone-200 flex items-center justify-center text-stone-700 font-bold transition-colors cursor-pointer shadow-2xs"
                    title="Increase guests"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Quick Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
                {quickGuestPills.map((count) => {
                  const isSelected = formData.guestCount === count;
                  return (
                    <button
                      key={count}
                      type="button"
                      onClick={() => handleGuestCountChange(count)}
                      className={`flex-1 min-w-[34px] py-1.5 px-2 rounded-xl text-xs font-black transition-all cursor-pointer border ${
                        isSelected
                          ? 'bg-amber-500 text-stone-950 border-amber-400 shadow-2xs scale-105'
                          : 'bg-stone-50 hover:bg-stone-100 text-stone-700 border-stone-200'
                      }`}
                    >
                      {count}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. Time Slot */}
            <div className="pt-3 border-t border-stone-100 space-y-2">
              <span className="font-extrabold text-stone-800 flex items-center gap-1.5 text-xs uppercase tracking-wider">
                <Clock className="w-4 h-4 text-rose-600" />
                Select Time Slot
              </span>
              <div className="grid grid-cols-4 gap-1.5">
                {timeSlots.map((slot) => {
                  const isSelected = formData.timeSlot === slot;
                  return (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, timeSlot: slot }))}
                      className={`py-2 px-1 rounded-xl text-xs font-bold text-center border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-rose-600 text-white border-rose-500 shadow-2xs'
                          : 'bg-stone-50 hover:bg-stone-100 text-stone-700 border-stone-200'
                      }`}
                    >
                      {slot}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* 4. Guest Contact Details */}
          <div className="space-y-3 bg-white border border-stone-200 p-4 sm:p-5 rounded-3xl shadow-xs">
            <span className="font-extrabold text-stone-800 flex items-center gap-1.5 text-xs uppercase tracking-wider">
              <User className="w-4 h-4 text-rose-600" />
              Primary Contact Details
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div className="relative">
                <User className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Your Full Name"
                  value={formData.customerName}
                  onChange={(e) => setFormData((prev) => ({ ...prev, customerName: e.target.value }))}
                  className="w-full pl-10 pr-3 py-2.5 text-xs rounded-xl bg-stone-50 border border-stone-200 hover:border-stone-300 text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-rose-500 transition-all font-medium"
                  required
                />
              </div>
              <div className="relative">
                <Phone className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="tel"
                  placeholder="Mobile Phone"
                  value={formData.customerPhone}
                  onChange={(e) => setFormData((prev) => ({ ...prev, customerPhone: e.target.value }))}
                  className="w-full pl-10 pr-3 py-2.5 text-xs rounded-xl bg-stone-50 border border-stone-200 hover:border-stone-300 text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-rose-500 transition-all font-medium"
                  required
                />
              </div>
            </div>
          </div>

          {/* Feedback & Notice Message */}
          {feedbackMessage && (
            <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center gap-2.5">
              <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
              <span className="font-medium">{feedbackMessage}</span>
            </div>
          )}

          {/* Errors */}
          {(holdError || confirmError || availabilityError) && (
            <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center justify-between gap-2.5">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{holdError || confirmError || availabilityError}</span>
              </div>
              {(holdError || confirmError) && (
                <button
                  type="button"
                  onClick={handleResetTestReservations}
                  className="text-xs underline font-bold text-rose-800 shrink-0 cursor-pointer"
                >
                  Reset Tables
                </button>
              )}
            </div>
          )}
        </div>

        {/* Right Column: Interactive Floor Plan Canvas */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-stone-200 p-3 sm:p-5 shadow-xs flex flex-col min-h-[480px]">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100 mb-2">
            <div>
              <h3 className="text-sm font-black text-stone-900">
                Interactive Restaurant Floor Plan
              </h3>
              <p className="text-[11px] text-stone-500 font-medium">
                Tap any green table to choose your seat
              </p>
            </div>
            {selectedTable && (
              <span className="text-xs font-bold text-rose-600 bg-rose-50 px-3 py-1 rounded-full border border-rose-200 font-mono">
                Selected: {selectedTable.tableNumber}
              </span>
            )}
          </div>

          <ErrorBoundary onReset={() => refreshAvailability(true)}>
            <FloorPlan
              tables={tables}
              selectedTableId={selectedTable?.id}
              onSelectTable={handleSelectTable}
              guestCount={formData.guestCount}
              isLoading={isLoadingAvailability}
            />
          </ErrorBoundary>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* ALWAYS-VISIBLE STICKY BOTTOM CONFIRMATION DOCK */}
      {/* ========================================================================= */}
      <div className="fixed bottom-0 inset-x-0 z-30 bg-white/95 backdrop-blur-xl border-t border-stone-200 shadow-2xl py-3 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Table Details Summary */}
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="w-12 h-12 rounded-2xl bg-rose-600 text-white font-black text-base flex items-center justify-center shrink-0 shadow-xs font-mono">
              {selectedTable ? selectedTable.tableNumber.replace('T-', '') : '??'}
            </div>
            <div>
              <h4 className="text-sm font-black text-stone-900 leading-tight">
                {selectedTable ? `${selectedTable.name} (${selectedTable.tableNumber})` : 'Tap a Table on Floor Plan'}
              </h4>
              <p className="text-xs text-stone-500 font-medium">
                {formData.date} · {formData.timeSlot} · <strong className="text-stone-800 font-bold">{formData.guestCount} Guests</strong>
              </p>
            </div>
          </div>

          {/* PRIMARY "Confirm Table & View Bill" CTA */}
          <button
            type="button"
            onClick={handleProceedToCartReview}
            disabled={isAcquiringHold}
            className="w-full sm:w-auto py-3.5 px-8 rounded-2xl font-black text-sm text-white bg-gradient-to-r from-rose-600 via-rose-500 to-amber-500 hover:from-rose-500 hover:to-amber-400 transition-all cursor-pointer shadow-lg shadow-rose-900/15 hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2.5 border border-rose-400/40 disabled:opacity-75 disabled:cursor-not-allowed"
          >
            {isAcquiringHold ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Locking Table in Redis (5-Min Hold)...</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-4 h-4" />
                <span>
                  Confirm Table {selectedTable?.tableNumber || ''} & View Bill Breakdown →
                </span>
              </>
            )}
          </button>
        </div>
      </div>

      <InfoLegendModal
        isOpen={isInfoModalOpen}
        onClose={() => setIsInfoModalOpen(false)}
        onResetTables={handleResetTestReservations}
      />
    </div>
  );
}
