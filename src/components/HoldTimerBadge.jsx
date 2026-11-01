'use client';

import React, { useEffect, useState } from 'react';
import { Clock, AlertTriangle, ShieldCheck } from 'lucide-react';

export default function HoldTimerBadge({
  expiresAt,
  onExpire,
  totalDurationSeconds = 300,
}) {
  const [secondsLeft, setSecondsLeft] = useState(() => {
    if (!expiresAt) return 0;
    return Math.max(0, Math.ceil((expiresAt - Date.now()) / 1000));
  });

  useEffect(() => {
    if (!expiresAt) return;

    const interval = setInterval(() => {
      const remaining = Math.max(0, Math.ceil((expiresAt - Date.now()) / 1000));
      setSecondsLeft(remaining);

      if (remaining <= 0) {
        clearInterval(interval);
        if (onExpire) onExpire();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [expiresAt, onExpire]);

  if (!expiresAt || secondsLeft <= 0) {
    return (
      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
        <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
        <span>Hold Expired</span>
      </div>
    );
  }

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const formatted = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  const isExpiringSoon = secondsLeft <= 60;
  const progressPercent = Math.min(100, Math.max(0, (secondsLeft / totalDurationSeconds) * 100));

  return (
    <div
      className={`relative overflow-hidden flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-bold transition-all ${
        isExpiringSoon
          ? 'bg-rose-50 border-rose-300 text-rose-800 animate-pulse'
          : 'bg-amber-50 border-amber-300 text-amber-800'
      }`}
    >
      {/* Background progress fill */}
      <div
        className={`absolute inset-0 opacity-20 pointer-events-none transition-all ${
          isExpiringSoon ? 'bg-rose-400' : 'bg-amber-400'
        }`}
        style={{ width: `${progressPercent}%` }}
      />

      <span className="relative z-10 flex items-center gap-1.5">
        <Clock className={`w-3.5 h-3.5 ${isExpiringSoon ? 'text-rose-600' : 'text-amber-600'}`} />
        <span className="font-mono tracking-wider">{formatted}</span>
        <span className="hidden sm:inline font-normal text-[10px] text-stone-500">hold</span>
      </span>
    </div>
  );
}
