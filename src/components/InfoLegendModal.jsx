'use client';

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Info, Clock, Users, Shield, MapPin, Sparkles, RefreshCw } from 'lucide-react';

export default function InfoLegendModal({ isOpen, onClose, onResetTables = null }) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="bg-white w-full max-w-sm rounded-3xl p-5 sm:p-6 shadow-2xl border border-stone-200 relative max-h-[90vh] overflow-y-auto text-stone-800"
        >
          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Header */}
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-9 h-9 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center">
              <Info className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-stone-900">
                Floor Plan & Seating Guide
              </h3>
              <p className="text-xs text-stone-500">Royal Spice&apos;s Dining & Lounge layout</p>
            </div>
          </div>

          {/* Table Color Legend */}
          <div className="space-y-2.5 bg-stone-50 p-3.5 rounded-2xl border border-stone-200/80 mb-4 text-xs">
            <h4 className="font-bold text-stone-500 text-[10px] uppercase tracking-wider">
              Status Legend
            </h4>
            
            <div className="flex items-center gap-2.5">
              <span className="w-4 h-4 rounded-md bg-white border-2 border-emerald-500 shrink-0" />
              <div>
                <p className="font-bold text-stone-900">Available Table</p>
                <p className="text-[11px] text-stone-500">Tap to select your table instantly.</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <span className="w-4 h-4 rounded-md bg-rose-600 border border-rose-400 shrink-0" />
              <div>
                <p className="font-bold text-rose-700">Selected Table</p>
                <p className="text-[11px] text-stone-500">Your chosen table highlighted in vivid ruby glow.</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <span className="w-4 h-4 rounded-md bg-amber-400 border border-amber-500 shrink-0" />
              <div>
                <p className="font-bold text-amber-800">5-Minute Hold</p>
                <p className="text-[11px] text-stone-500">Temporarily locked while a guest completes checkout.</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <span className="w-4 h-4 rounded-md bg-stone-200 border border-stone-300 shrink-0" />
              <div>
                <p className="font-bold text-stone-500">Booked / Reserved</p>
                <p className="text-[11px] text-stone-400">Already confirmed for this date and time.</p>
              </div>
            </div>
          </div>

          {/* Zones */}
          <div className="space-y-2 text-xs mb-5">
            <h4 className="font-bold text-stone-500 text-[10px] uppercase tracking-wider">
              Seating Zones
            </h4>
            <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200/60 flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-stone-900">Center Lounge (T-06, T-07)</p>
                <p className="text-[11px] text-stone-500">Spacious 6-person circular tables under chandeliers.</p>
              </div>
            </div>
            <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200/60 flex items-start gap-2">
              <MapPin className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-stone-900">North Terrace (T-01, T-02)</p>
                <p className="text-[11px] text-stone-500">4-person rectangular tables overlooking the garden.</p>
              </div>
            </div>
            <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200/60 flex items-start gap-2">
              <Users className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-stone-900">Wall Alcoves (T-03 to T-05, T-08 to T-10)</p>
                <p className="text-[11px] text-stone-500">Intimate 2-person velvet padded booths for romantic dining.</p>
              </div>
            </div>
          </div>

          {/* Reset button if available */}
          {onResetTables && (
            <button
              type="button"
              onClick={() => {
                onResetTables();
                onClose();
              }}
              className="w-full py-2.5 px-3 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs flex items-center justify-center gap-2 border border-stone-200 mb-2 cursor-pointer transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5 text-rose-600" />
              <span>Reset All Test Reservations</span>
            </button>
          )}

          <button
            type="button"
            onClick={onClose}
            className="w-full py-3 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs transition-colors cursor-pointer shadow-md"
          >
            Got it, Return to Map
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
