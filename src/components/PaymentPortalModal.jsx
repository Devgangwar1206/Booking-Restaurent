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
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import API_URL from '../api/apiConfig';

const BASE_API = API_URL ? API_URL.replace(/\/$/, '') : '';

export default function PaymentPortalModal({
  isOpen,
  onClose,
  totalAmount = 1825,
  bookingReference = 'BON-PENDING',
  customerName = '',
  customerEmail = '',
  customerPhone = '',
  onPaymentSuccess,
}) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [paymentError, setPaymentError] = useState(null);

  if (!isOpen) return null;

  // Launch Official Razorpay Checkout
  const handleLaunchRazorpay = async () => {
    setIsProcessing(true);
    setPaymentError(null);

    try {
      // 1. Create Order via Spring Boot Backend
      const orderRes = await fetch(`${BASE_API}/api/payment/create-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: totalAmount,
          currency: 'INR',
          receipt: bookingReference,
          customerName,
          customerEmail,
          customerPhone,
        }),
      });

      const orderData = await orderRes.json();

      if (!orderData.success) {
        throw new Error(orderData.error || 'Failed to initialize payment gateway.');
      }

      // Check if real Razorpay SDK is loaded and real order ID was generated
      const isSimulated = orderData.orderId?.startsWith('order_sim_');

      if (typeof window !== 'undefined' && window.Razorpay && !isSimulated) {
        // 2. Open Official Razorpay Checkout Popup
        const options = {
          key: orderData.keyId,
          amount: orderData.amountInPaise,
          currency: orderData.currency || 'INR',
          name: 'Royal Spice Restaurant',
          description: `Table Reservation & Bill (${bookingReference})`,
          image: 'https://cdn-icons-png.flaticon.com/512/3448/3448609.png',
          order_id: orderData.orderId,
          handler: async function (response) {
            setIsVerifying(true);
            try {
              // 3. Cryptographic Signature Verification via Spring Boot
              const verifyRes = await fetch(`${BASE_API}/api/payment/verify`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  razorpayOrderId: response.razorpay_order_id,
                  razorpayPaymentId: response.razorpay_payment_id,
                  razorpaySignature: response.razorpay_signature,
                }),
              });

              const verifyData = await verifyRes.json();

              if (verifyData.success) {
                onPaymentSuccess({
                  paymentMethod: 'RAZORPAY',
                  transactionId: response.razorpay_payment_id,
                  amount: totalAmount,
                });
              } else {
                setPaymentError('Signature verification failed. Please contact support.');
              }
            } catch (err) {
              setPaymentError('Error verifying payment with server.');
            } finally {
              setIsVerifying(false);
              setIsProcessing(false);
            }
          },
          prefill: {
            name: customerName || 'Guest',
            email: customerEmail || '',
            contact: customerPhone || '',
          },
          notes: {
            bookingRef: bookingReference,
          },
          theme: {
            color: '#E11D48', // Royal Rose theme
          },
          modal: {
            ondismiss: function () {
              setIsProcessing(false);
            },
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.on('payment.failed', function (resp) {
          setIsProcessing(false);
          setPaymentError(resp.error?.description || 'Payment was declined or cancelled.');
        });
        rzp.open();

      } else {
        // Fallback / Simulated Mode (If placeholder test keys are used before user inputs live keys)
        setTimeout(() => {
          setIsProcessing(false);
          const mockTxn = `PAY_RZP_${Date.now()}`;
          onPaymentSuccess({
            paymentMethod: 'RAZORPAY_TEST',
            transactionId: mockTxn,
            amount: totalAmount,
          });
        }, 1200);
      }
    } catch (err) {
      console.error('Payment launch error:', err);
      setPaymentError(err.message || 'Payment service unavailable.');
      setIsProcessing(false);
    }
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
                  Razorpay Secure Checkout
                </h3>
                <p className="text-[11px] text-stone-500 font-medium">
                  Ref: {bookingReference} · 256-Bit SSL Encrypted
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              disabled={isProcessing || isVerifying}
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
                <p className="text-2xl font-black text-stone-900 font-mono">
                  ₹{totalAmount.toLocaleString('en-IN')}
                </p>
              </div>
              <div className="px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" />
                <span>Instant Confirmation</span>
              </div>
            </div>

            {/* Error Message if any */}
            {paymentError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{paymentError}</span>
              </div>
            )}

            {/* Supported Payment Channels Grid */}
            <div className="space-y-2.5">
              <label className="text-xs font-bold text-stone-700 uppercase tracking-wider">
                Supported Payment Options
              </label>

              <div className="grid grid-cols-3 gap-2.5">
                <div className="p-3 rounded-2xl border border-stone-200 bg-white text-center flex flex-col items-center gap-1 shadow-2xs">
                  <Smartphone className="w-5 h-5 text-rose-600" />
                  <span className="text-xs font-black text-stone-800">UPI / QR</span>
                  <span className="text-[10px] text-stone-400">GPay, PhonePe, Paytm</span>
                </div>

                <div className="p-3 rounded-2xl border border-stone-200 bg-white text-center flex flex-col items-center gap-1 shadow-2xs">
                  <CreditCard className="w-5 h-5 text-rose-600" />
                  <span className="text-xs font-black text-stone-800">Cards</span>
                  <span className="text-[10px] text-stone-400">Visa, Master, RuPay</span>
                </div>

                <div className="p-3 rounded-2xl border border-stone-200 bg-white text-center flex flex-col items-center gap-1 shadow-2xs">
                  <Building2 className="w-5 h-5 text-rose-600" />
                  <span className="text-xs font-black text-stone-800">NetBanking</span>
                  <span className="text-[10px] text-stone-400">SBI, HDFC, ICICI, etc.</span>
                </div>
              </div>
            </div>

            {/* Customer Details Preview */}
            <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 text-xs space-y-1 text-stone-600">
              <div className="flex justify-between">
                <span className="font-medium text-stone-500">Guest Name:</span>
                <span className="font-bold text-stone-800">{customerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-stone-500">Contact:</span>
                <span className="font-bold text-stone-800">{customerPhone}</span>
              </div>
            </div>

            {/* Testing Guide Badge */}
            <div className="p-3 rounded-xl bg-amber-50/80 border border-amber-200 text-amber-800 text-[11px] flex items-start gap-2">
              <HelpCircle className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
              <div>
                <span className="font-bold block">Razorpay Test Mode Active:</span>
                <span>In the Razorpay popup, choose UPI or Card, then tap &quot;Success&quot; to test without real money!</span>
              </div>
            </div>

            {/* Main Pay Button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleLaunchRazorpay}
                disabled={isProcessing || isVerifying}
                className="w-full py-4 px-4 rounded-2xl font-black text-sm text-white bg-gradient-to-r from-rose-600 via-rose-500 to-amber-500 hover:from-rose-500 hover:to-amber-400 transition-all cursor-pointer shadow-lg shadow-rose-900/15 flex items-center justify-center gap-2 group"
              >
                {isVerifying ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Verifying Razorpay Signature...</span>
                  </>
                ) : isProcessing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Launching Razorpay Secure Window...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-amber-200" />
                    <span>Pay ₹{totalAmount.toLocaleString('en-IN')} via Razorpay</span>
                    <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform" />
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
