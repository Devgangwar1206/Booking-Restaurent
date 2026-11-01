'use client';

import React from 'react';
import {
  ArrowLeft,
  ShoppingBag,
  Plus,
  Minus,
  Receipt,
  CreditCard,
  Building,
  Sparkles,
  Users,
  Calendar,
  Clock,
  ShieldCheck,
  CheckCircle2,
  UtensilsCrossed,
} from 'lucide-react';

export default function OrderCartReviewPage({
  selectedTable,
  formData,
  cartItems = [],
  onUpdateQuantity,
  onAddQuickItem,
  onBack,
  onPayAtRestaurant,
  onPayNow,
  isSubmitting = false,
}) {
  // Calculations based on actual customer cart items
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const hasItems = cartItems.length > 0 && subtotal > 0;
  const gstCharges = hasItems ? 40 : 0; // Explicitly ₹40 GST when items are ordered
  const restaurantCharges = hasItems ? 35 : 0; // Explicitly ₹35 Restaurant charges when items are ordered
  const totalAmount = hasItems ? (subtotal + gstCharges + restaurantCharges) : 0;

  const isLargeParty = formData.guestCount > (selectedTable?.capacity || 4);

  return (
    <div className="w-full min-h-screen flex flex-col bg-stone-50/60 text-stone-900 no-scrollbar overflow-x-hidden">
      {/* Top Breadcrumb & Navigation */}
      <div className="py-3 px-4 sm:px-6 bg-white border-b border-stone-200/90 flex items-center justify-between sticky top-0 z-20 shadow-2xs">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-600 hover:text-stone-900 px-3 py-1.5 rounded-xl border border-stone-200 hover:bg-stone-50 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Table Selection</span>
        </button>

        {/* Step Indicator */}
        <div className="hidden sm:flex items-center gap-2 text-xs font-semibold">
          <span className="text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> 1. Table Picked
          </span>
          <span className="text-stone-300">→</span>
          <span className="text-rose-700 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200 font-bold">
            2. Cart & Bill Review
          </span>
          <span className="text-stone-300">→</span>
          <span className="text-stone-400 bg-stone-100 px-2.5 py-1 rounded-full">
            3. Final Pass
          </span>
        </div>

        <div className="text-right">
          <span className="text-[10px] uppercase font-bold text-stone-400 block">Total Due</span>
          <span className="text-sm font-black text-stone-900 font-mono">
            ₹{totalAmount.toLocaleString('en-IN')}
          </span>
        </div>
      </div>

      {/* Main Container */}
      <div className="flex-1 max-w-5xl w-full mx-auto p-3 sm:p-6 lg:p-8 space-y-6">
        {/* Header Title */}
        <div className="space-y-1">
          <h2 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
            Order Review & Table Confirmation
          </h2>
          <p className="text-xs sm:text-sm text-stone-500">
            Review your pre-ordered menu items, view itemized bill breakdown, and choose your preferred payment option.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-start">
          {/* Left Column (7 cols): Selected Table Info + Cart Items */}
          <div className="lg:col-span-7 space-y-4">
            {/* Table Details Card */}
            <div className="bg-white border border-stone-200 rounded-3xl p-4 sm:p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-rose-600 text-white flex items-center justify-center font-black text-base shadow-xs font-mono">
                    {selectedTable?.tableNumber || 'T-06'}
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-stone-900">
                      {selectedTable?.name || "Chef's Round Table"}
                    </h3>
                    <p className="text-xs text-stone-500 font-medium">
                      {selectedTable?.zone || 'Center Lounge'} · Royal Spice&apos;s Dining
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                    Ready to Confirm
                  </span>
                </div>
              </div>

              {/* Booking Highlights Grid */}
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-100 space-y-0.5">
                  <span className="text-[10px] uppercase font-bold text-stone-400 flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-rose-600" /> Date
                  </span>
                  <p className="font-bold text-stone-800 truncate">{formData.date}</p>
                </div>
                <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-100 space-y-0.5">
                  <span className="text-[10px] uppercase font-bold text-stone-400 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-rose-600" /> Time Slot
                  </span>
                  <p className="font-bold text-stone-800 truncate">{formData.timeSlot}</p>
                </div>
                <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-100 space-y-0.5">
                  <span className="text-[10px] uppercase font-bold text-stone-400 flex items-center gap-1">
                    <Users className="w-3 h-3 text-rose-600" /> Party Size
                  </span>
                  <p className="font-bold text-stone-800">{formData.guestCount} Guests</p>
                </div>
              </div>

              {/* Large Party Banner if applicable */}
              {isLargeParty && (
                <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center gap-2.5">
                  <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                  <div>
                    <span className="font-bold">Grand Group Seating Arranged: </span>
                    <span>
                      Our team will join adjacent seating and prepare extra chairs for your party of {formData.guestCount}.
                    </span>
                  </div>
                </div>
              )}

              {/* Guest Primary Contact */}
              <div className="pt-1 flex items-center justify-between text-xs text-stone-600 border-t border-stone-100">
                <span>Reserved For: <strong className="text-stone-900">{formData.customerName}</strong></span>
                <span>Phone: <strong className="text-stone-900">{formData.customerPhone}</strong></span>
              </div>
            </div>

            {/* Cart Items List */}
            <div className="bg-white border border-stone-200 rounded-3xl p-4 sm:p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4 text-rose-600" />
                  <h3 className="text-sm font-black text-stone-900 uppercase tracking-wider">
                    Customer Cart Items ({cartItems.length})
                  </h3>
                </div>
                <span className="text-[11px] text-stone-500 font-medium">
                  {cartItems.length > 0 ? 'Website Cart Items' : 'No Items Added'}
                </span>
              </div>

              {cartItems.length === 0 ? (
                <div className="p-6 text-center rounded-2xl bg-stone-50/70 border border-stone-200/70 space-y-3">
                  <div className="w-12 h-12 rounded-full bg-stone-100 flex items-center justify-center mx-auto text-stone-400">
                    <UtensilsCrossed className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-stone-800">No Food Pre-ordered</h4>
                    <p className="text-[11px] text-stone-500 max-w-sm mx-auto mt-0.5">
                      You haven&apos;t added food dishes to your cart yet. You can confirm your table reservation now and order directly from our table menu upon arrival!
                    </p>
                  </div>
                  {onAddQuickItem && (
                    <button
                      type="button"
                      onClick={onAddQuickItem}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-stone-50 border border-stone-200 text-xs font-bold text-rose-600 shadow-2xs transition-colors cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Chef&apos;s Special Dish to Cart</span>
                    </button>
                  )}
                </div>
              ) : (
                <div className="space-y-2.5">
                  {cartItems.map((item) => (
                    <div
                      key={item.id}
                      className="p-3 rounded-2xl bg-stone-50/80 border border-stone-200/80 flex items-center justify-between gap-3"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          {item.isVeg !== undefined && (
                            <span className="w-2.5 h-2.5 rounded-full border border-emerald-600 flex items-center justify-center p-0.5 shrink-0">
                              <span className={`w-1.5 h-1.5 rounded-full ${item.isVeg ? 'bg-emerald-600' : 'bg-red-600'}`} />
                            </span>
                          )}
                          <h4 className="text-xs font-bold text-stone-900 truncate">
                            {item.name}
                          </h4>
                        </div>
                        <span className="text-[10px] text-stone-500 font-medium">
                          {item.category || 'Special Dish'} · ₹{item.price} each
                        </span>
                      </div>

                      {/* Quantity Stepper */}
                      <div className="flex items-center gap-2 shrink-0">
                        {onUpdateQuantity && (
                          <div className="flex items-center border border-stone-300 rounded-xl bg-white overflow-hidden shadow-2xs">
                            <button
                              type="button"
                              onClick={() => onUpdateQuantity(item.id, -1)}
                              className="p-1.5 hover:bg-stone-100 text-stone-600 transition-colors cursor-pointer"
                              title="Decrease quantity"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="px-2 text-xs font-black text-stone-800 font-mono">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => onUpdateQuantity(item.id, 1)}
                              className="p-1.5 hover:bg-stone-100 text-stone-600 transition-colors cursor-pointer"
                              title="Increase quantity"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        )}

                        <span className="w-14 text-right text-xs font-black text-stone-900 font-mono">
                          ₹{item.price * item.quantity}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Add item helper if cart already has items */}
              {hasItems && onAddQuickItem && (
                <button
                  type="button"
                  onClick={onAddQuickItem}
                  className="w-full py-2.5 px-3 rounded-2xl border border-dashed border-rose-300 hover:border-rose-500 bg-rose-50/50 hover:bg-rose-50 text-rose-700 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Another Dish from Menu</span>
                </button>
              )}
            </div>
          </div>

          {/* Right Column (5 cols): Bill Generation & Action Buttons */}
          <div className="lg:col-span-5 space-y-4">
            {/* Bill Summary Card */}
            <div className="bg-white border border-stone-200 rounded-3xl p-5 sm:p-6 shadow-md space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-stone-100">
                <Receipt className="w-4 h-4 text-rose-600" />
                <h3 className="text-sm font-black text-stone-900 uppercase tracking-wider">
                  Bill Summary & Breakdown
                </h3>
              </div>

              {/* Itemized Calculations */}
              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between py-1 text-stone-600">
                  <span>Cart Items Subtotal</span>
                  <span className="font-bold text-stone-800 font-mono">
                    ₹{subtotal.toLocaleString('en-IN')}
                  </span>
                </div>

                {hasItems ? (
                  <>
                    <div className="flex justify-between py-1 text-stone-600">
                      <div className="flex items-center gap-1">
                        <span>GST & Government Taxes</span>
                        <span className="text-[10px] text-stone-400 font-mono">(5%)</span>
                      </div>
                      <span className="font-bold text-stone-800 font-mono">
                        +₹{gstCharges}
                      </span>
                    </div>

                    <div className="flex justify-between py-1 text-stone-600">
                      <div className="flex items-center gap-1">
                        <span>Restaurant Service & Charges</span>
                        <span className="text-[10px] text-stone-400 font-mono">(Hospitality)</span>
                      </div>
                      <span className="font-bold text-stone-800 font-mono">
                        +₹{restaurantCharges}
                      </span>
                    </div>
                  </>
                ) : (
                  <div className="flex justify-between py-1 text-emerald-700">
                    <span>Table Reservation Fee</span>
                    <span className="font-bold font-mono">₹0 (Complimentary)</span>
                  </div>
                )}

                <div className="pt-3 border-t-2 border-dashed border-stone-200 flex justify-between items-baseline">
                  <div>
                    <span className="text-xs uppercase font-extrabold text-stone-500 tracking-wider">
                      Grand Total Amount
                    </span>
                    <p className="text-[10px] text-stone-400 font-medium">
                      {hasItems ? 'All taxes & service included' : 'Zero booking fee'}
                    </p>
                  </div>
                  <span className="text-2xl font-black text-rose-600 font-mono">
                    ₹{totalAmount.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Guarantees */}
              <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200/80 text-[11px] text-stone-600 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Zero cancellation fees up to 1 hour before dining.</span>
              </div>

              {/* ACTION BUTTONS (Pay at Restaurant & Pay Now) */}
              <div className="space-y-2.5 pt-2">
                {/* 1. Pay at Restaurant / Confirm Table Button */}
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => onPayAtRestaurant({
                    subtotal,
                    gst: gstCharges,
                    restaurantCharges,
                    total: totalAmount,
                    cartItems,
                  })}
                  className="w-full py-3.5 px-4 rounded-2xl font-black text-xs sm:text-sm text-stone-800 bg-stone-100 hover:bg-stone-200 border border-stone-300 transition-all cursor-pointer flex items-center justify-between shadow-2xs hover:shadow-xs group"
                >
                  <div className="flex items-center gap-2 text-left">
                    <Building className="w-4 h-4 text-stone-600 group-hover:text-stone-900" />
                    <div>
                      <span className="block leading-tight font-black">
                        {hasItems ? 'Pay at Restaurant' : 'Confirm Table Reservation'}
                      </span>
                      <span className="text-[10px] text-stone-500 font-normal">
                        {hasItems ? 'Book table now · Pay after dining' : 'No payment required · Free booking'}
                      </span>
                    </div>
                  </div>
                  <span className="text-stone-400 group-hover:text-stone-900 font-bold">→</span>
                </button>

                {/* 2. Pay Now Button (Only relevant when cart has items) */}
                {hasItems && (
                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={() => onPayNow({
                      subtotal,
                      gst: gstCharges,
                      restaurantCharges,
                      total: totalAmount,
                      cartItems,
                    })}
                    className="w-full py-3.5 px-4 rounded-2xl font-black text-xs sm:text-sm text-white bg-gradient-to-r from-rose-600 via-rose-500 to-amber-500 hover:from-rose-500 hover:to-amber-400 transition-all cursor-pointer shadow-md hover:shadow-lg flex items-center justify-between border border-rose-400/40 group"
                  >
                    <div className="flex items-center gap-2 text-left">
                      <CreditCard className="w-4 h-4 text-white" />
                      <div>
                        <span className="block leading-tight font-black">
                          Pay Now (₹{totalAmount.toLocaleString('en-IN')})
                        </span>
                        <span className="text-[10px] text-rose-100 font-medium">
                          UPI · Credit/Debit Cards · NetBanking
                        </span>
                      </div>
                    </div>
                    <Sparkles className="w-4 h-4 text-amber-200" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
