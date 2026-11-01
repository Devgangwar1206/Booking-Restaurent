'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  CreditCard,
  QrCode,
  Building2,
  ShieldCheck,
  CheckCircle2,
  Lock,
  ArrowRight,
  Smartphone,
  Sparkles,
} from 'lucide-react';

export default function PaymentPortalModal({
  isOpen,
  onClose,
  totalAmount = 1825,
  bookingReference = 'BON-PENDING',
  onPaymentSuccess,
}) {
  const [selectedMethod, setSelectedMethod] = useState('UPI'); // UPI | CARD | NETBANKING
  const [upiId, setUpiId] = useState('user@okaxis');
  const [isProcessing, setIsProcessing] = useState(false);
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '•••• •••• •••• 4242',
    cardName: 'Alex Morgan',
    expiry: '08/29',
    cvv: '•••',
  });
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');

  if (!isOpen) return null;

  const handlePayNow = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      const transactionId = `TXN_${Date.now()}_${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
      onPaymentSuccess({
        paymentMethod: selectedMethod,
        transactionId,
        amount: totalAmount,
      });
    }, 1500);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-900/60 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden text-stone-900"
        >
          {/* Header */}
          <div className="px-6 py-4 bg-gradient-to-r from-rose-50 via-white to-amber-50 border-b border-stone-200 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-rose-600 text-white flex items-center justify-center shadow-xs">
                <Lock className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-black text-stone-900 leading-tight">
                  Secure Checkout
                </h3>
                <p className="text-[11px] text-stone-500 font-medium">
                  Ref: {bookingReference} · 256-Bit Encrypted
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              disabled={isProcessing}
              className="w-8 h-8 rounded-full flex items-center justify-center text-stone-500 hover:text-stone-800 hover:bg-stone-100 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-6 space-y-5">
            {/* Amount Banner */}
            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 flex items-center justify-between">
              <div>
                <span className="text-[11px] uppercase tracking-wider font-bold text-stone-500">
                  Total Payable Amount
                </span>
                <p className="text-2xl font-black text-stone-900">
                  ₹{totalAmount.toLocaleString('en-IN')}
                </p>
              </div>
              <div className="px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" />
                <span>Instant Confirmation</span>
              </div>
            </div>

            {/* Payment Method Tabs */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-stone-700 uppercase tracking-wider">
                Select Payment Method
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedMethod('UPI')}
                  className={`p-3 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1.5 ${
                    selectedMethod === 'UPI'
                      ? 'border-rose-500 bg-rose-50/70 text-rose-800 shadow-xs'
                      : 'border-stone-200 bg-white hover:bg-stone-50 text-stone-700'
                  }`}
                >
                  <Smartphone className="w-5 h-5 text-rose-600" />
                  <span className="text-xs font-bold">UPI / QR</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedMethod('CARD')}
                  className={`p-3 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1.5 ${
                    selectedMethod === 'CARD'
                      ? 'border-rose-500 bg-rose-50/70 text-rose-800 shadow-xs'
                      : 'border-stone-200 bg-white hover:bg-stone-50 text-stone-700'
                  }`}
                >
                  <CreditCard className="w-5 h-5 text-rose-600" />
                  <span className="text-xs font-bold">Cards</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedMethod('NETBANKING')}
                  className={`p-3 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1.5 ${
                    selectedMethod === 'NETBANKING'
                      ? 'border-rose-500 bg-rose-50/70 text-rose-800 shadow-xs'
                      : 'border-stone-200 bg-white hover:bg-stone-50 text-stone-700'
                  }`}
                >
                  <Building2 className="w-5 h-5 text-rose-600" />
                  <span className="text-xs font-bold">NetBanking</span>
                </button>
              </div>
            </div>

            {/* Method Details */}
            {selectedMethod === 'UPI' && (
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-stone-700">Scan QR or enter VPA ID</span>
                  <span className="text-[10px] text-stone-500 font-mono">GPay · PhonePe · Paytm</span>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4 bg-white p-3 rounded-xl border border-stone-200">
                  <div className="p-2 bg-stone-50 rounded-lg border border-stone-200 shrink-0">
                    <QrCode className="w-16 h-16 text-stone-900" />
                  </div>
                  <div className="flex-1 w-full space-y-1.5">
                    <label className="text-[10px] uppercase font-bold text-stone-500">Enter UPI ID</label>
                    <input
                      type="text"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      placeholder="e.g. mobile@upi"
                      className="w-full px-3 py-1.5 text-xs font-mono rounded-lg border border-stone-300 bg-stone-50 text-stone-900 focus:outline-none focus:border-rose-500 font-semibold"
                    />
                    <p className="text-[10px] text-stone-400">
                      Scan the QR code with any UPI app or click Pay Now.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {selectedMethod === 'CARD' && (
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2.5">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-stone-500">Card Number</label>
                  <input
                    type="text"
                    value={cardDetails.cardNumber}
                    onChange={(e) => setCardDetails((p) => ({ ...p, cardNumber: e.target.value }))}
                    className="w-full px-3 py-1.5 text-xs font-mono rounded-lg border border-stone-300 bg-white text-stone-900 font-bold focus:outline-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-stone-500">Expiry Date</label>
                    <input
                      type="text"
                      value={cardDetails.expiry}
                      onChange={(e) => setCardDetails((p) => ({ ...p, expiry: e.target.value }))}
                      className="w-full px-3 py-1.5 text-xs rounded-lg border border-stone-300 bg-white text-stone-900 font-semibold focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-stone-500">CVV</label>
                    <input
                      type="password"
                      value={cardDetails.cvv}
                      onChange={(e) => setCardDetails((p) => ({ ...p, cvv: e.target.value }))}
                      className="w-full px-3 py-1.5 text-xs rounded-lg border border-stone-300 bg-white text-stone-900 font-semibold focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {selectedMethod === 'NETBANKING' && (
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2.5">
                <label className="text-xs font-bold text-stone-700">Choose Bank</label>
                <div className="grid grid-cols-2 gap-2">
                  {['HDFC Bank', 'ICICI Bank', 'State Bank of India', 'Axis Bank'].map((bank) => (
                    <button
                      key={bank}
                      type="button"
                      onClick={() => setSelectedBank(bank)}
                      className={`p-2.5 text-xs font-bold rounded-xl border text-left transition-all cursor-pointer ${
                        selectedBank === bank
                          ? 'border-rose-500 bg-rose-50 text-rose-800'
                          : 'border-stone-200 bg-white text-stone-700 hover:bg-stone-50'
                      }`}
                    >
                      {bank}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handlePayNow}
                disabled={isProcessing}
                className="w-full py-3.5 px-4 rounded-2xl font-black text-sm text-white bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:to-teal-500 transition-all cursor-pointer shadow-lg shadow-emerald-900/10 flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Processing Payment of ₹{totalAmount.toLocaleString('en-IN')}...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Pay ₹{totalAmount.toLocaleString('en-IN')} & Confirm Table</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
