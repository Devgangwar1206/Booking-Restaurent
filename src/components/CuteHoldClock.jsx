'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Clock, AlertTriangle, ShieldCheck, Sparkles, ChevronRight, ChevronLeft } from 'lucide-react';

/**
 * CuteHoldClock
 * An adorable, luxury floating live timer widget fixed on the side of the screen.
 * Shows remaining time (5-minute countdown), circular progress ring, table badge,
 * and gentle pulse when expiring soon.
 */
export default function CuteHoldClock({
  expiresAt,
  tableNumber,
  tableName,
  onExpire,
  totalDurationSeconds = 300,
  isOutsideForm = false,
  onResumeBooking = null,
}) {
  const parseExpiresTime = (val) => {
    if (!val) return 0;
    if (typeof val === 'number') return val;
    const num = Number(val);
    if (!isNaN(num)) return num;
    return new Date(val).getTime();
  };

  const [secondsLeft, setSecondsLeft] = useState(() => {
    if (!expiresAt) return 0;
    const expTime = parseExpiresTime(expiresAt);
    return Math.max(0, Math.ceil((expTime - Date.now()) / 1000));
  });

  const [isMinimized, setIsMinimized] = useState(false);

  useEffect(() => {
    if (!expiresAt) return;

    const tick = () => {
      const expTime = parseExpiresTime(expiresAt);
      const remaining = Math.max(0, Math.ceil((expTime - Date.now()) / 1000));
      setSecondsLeft(remaining);

      if (remaining <= 0) {
        if (onExpire) onExpire();
      }
    };

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [expiresAt, onExpire]);

  if (!expiresAt || secondsLeft <= 0) {
    return null;
  }

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  const isUrgent = secondsLeft <= 60; // Under 1 minute left

  // Calculate circular SVG stroke progress (radius = 18, circumference = 2 * PI * 18 = 113.1)
  const radius = 18;
  const circumference = 2 * Math.PI * radius;
  const progressRatio = Math.min(1, Math.max(0, secondsLeft / totalDurationSeconds));
  const strokeDashoffset = circumference - progressRatio * circumference;

  return (
    <div className="fixed top-20 sm:top-24 right-3 sm:right-6 z-[9999] pointer-events-auto select-none font-sans">
      <AnimatePresence mode="wait">
        {!isMinimized ? (
          <motion.div
            key="clock-expanded"
            initial={{ opacity: 0, scale: 0.85, x: 30 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.85, x: 30 }}
            transition={{ type: 'spring', stiffness: 350, damping: 25 }}
            className={`relative rounded-3xl p-3 sm:p-3.5 shadow-2xl backdrop-blur-xl border transition-all duration-300 ${
              isUrgent
                ? 'bg-gradient-to-br from-white/95 via-rose-50/95 to-amber-50/95 border-rose-300 shadow-rose-900/20 ring-2 ring-rose-400/50'
                : 'bg-gradient-to-br from-white/95 via-stone-50/95 to-amber-50/90 border-amber-200/90 shadow-stone-900/15'
            }`}
            style={{ maxWidth: '280px' }}
          >
            {/* Cute Top Ribbon */}
            <div className="flex items-center justify-between gap-2 pb-2 mb-2 border-b border-stone-100">
              <div className="flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${isUrgent ? 'bg-rose-500 animate-ping' : 'bg-emerald-500 animate-pulse'}`} />
                <span className="text-[10px] uppercase font-black tracking-wider text-stone-500">
                  {isUrgent ? 'Hurry! Expiring Soon' : 'Table Lock Active'}
                </span>
              </div>

              {/* Minimize cute button */}
              <button
                type="button"
                onClick={() => setIsMinimized(true)}
                className="w-5 h-5 rounded-full hover:bg-stone-200/60 flex items-center justify-center text-stone-400 hover:text-stone-700 transition-colors cursor-pointer"
                title="Minimize clock"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Main Clock Face & Time Display */}
            <div className="flex items-center gap-3">
              {/* Circular SVG Progress Ring */}
              <div className="relative w-12 h-12 shrink-0 flex items-center justify-center">
                <svg className="w-12 h-12 -rotate-90 transform" viewBox="0 0 44 44">
                  {/* Track ring */}
                  <circle
                    cx="22"
                    cy="22"
                    r={radius}
                    className="stroke-stone-200"
                    strokeWidth="3.5"
                    fill="transparent"
                  />
                  {/* Animated Progress ring */}
                  <circle
                    cx="22"
                    cy="22"
                    r={radius}
                    stroke={isUrgent ? '#e11d48' : '#d97706'}
                    strokeWidth="3.5"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    fill="transparent"
                    className="transition-all duration-1000 ease-linear"
                  />
                </svg>

                {/* Center Cute Icon */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <Clock className={`w-5 h-5 transition-transform duration-300 ${isUrgent ? 'text-rose-600 animate-bounce' : 'text-amber-600'}`} />
                </div>
              </div>

              {/* Time & Table Info */}
              <div className="flex-1 min-w-0 text-left">
                <div className="flex items-baseline gap-1">
                  <span className={`text-2xl font-black font-mono tracking-tight ${isUrgent ? 'text-rose-600' : 'text-stone-900'}`}>
                    {formattedTime}
                  </span>
                  <span className="text-[10px] font-bold text-stone-400 uppercase">left</span>
                </div>

                <div className="text-[11px] font-bold text-stone-700 truncate mt-0.5">
                  {tableNumber ? `${tableNumber} reserved` : 'Table reserved'}
                </div>
              </div>
            </div>

            {/* Resume button when outside form */}
            {isOutsideForm && onResumeBooking && (
              <button
                type="button"
                onClick={onResumeBooking}
                className="mt-2.5 w-full py-2 px-3 rounded-xl bg-gradient-to-r from-rose-600 to-amber-500 hover:from-rose-500 hover:to-amber-400 text-white font-black text-xs flex items-center justify-center gap-1.5 shadow-md shadow-rose-900/10 cursor-pointer transition-transform hover:scale-[1.02] active:scale-[0.98]"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Resume Booking & Pay →</span>
              </button>
            )}

            {/* Cute bottom notice */}
            <div className="mt-2.5 pt-2 border-t border-stone-100/80 flex items-center justify-between text-[10px] text-stone-500">
              <span className="flex items-center gap-1 font-medium">
                <ShieldCheck className="w-3 h-3 text-emerald-600 shrink-0" />
                Redis 5-min protection
              </span>
              <span className="text-[9px] bg-amber-100/80 text-amber-900 px-1.5 py-0.5 rounded-md font-semibold">
                Pay to confirm
              </span>
            </div>
          </motion.div>
        ) : (
          /* Minimized Cute Floating Pill */
          <motion.button
            key="clock-minimized"
            type="button"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={() => {
              if (isOutsideForm && onResumeBooking) {
                onResumeBooking();
              } else {
                setIsMinimized(false);
              }
            }}
            className={`px-3 py-2 rounded-full shadow-xl border flex items-center gap-2 cursor-pointer transition-all hover:scale-105 backdrop-blur-md ${
              isUrgent
                ? 'bg-rose-500 text-white border-rose-600 animate-pulse'
                : 'bg-white/95 text-stone-800 border-amber-300 shadow-amber-900/10'
            }`}
            title="Click to expand 5-minute timer"
          >
            <Clock className={`w-4 h-4 ${isUrgent ? 'text-white' : 'text-amber-600 animate-spin'}`} style={{ animationDuration: '6s' }} />
            <span className="text-xs font-black font-mono tracking-wider">{formattedTime}</span>
            <span className="text-[10px] font-bold uppercase opacity-80">{tableNumber || 'Table'}</span>
            <ChevronLeft className="w-3 h-3 opacity-60" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
