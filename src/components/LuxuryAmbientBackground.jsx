'use client';

import React from 'react';
import { motion } from 'motion/react';
import { Sparkles } from 'lucide-react';

export default function LuxuryAmbientBackground({
  activeMood = 'champagne',
  onMoodChange,
  showMoodControls = true,
}) {
  const moods = {
    champagne: {
      name: 'Champagne Warmth',
      bg: 'radial-gradient(ellipse at 50% 20%, rgba(254, 243, 199, 0.45) 0%, rgba(255, 255, 255, 0.95) 70%)',
      accent1: 'rgba(251, 191, 36, 0.15)',
      accent2: 'rgba(244, 63, 94, 0.12)',
    },
    daylight: {
      name: 'Fresh Daylight',
      bg: 'radial-gradient(ellipse at 50% 20%, rgba(240, 253, 250, 0.5) 0%, rgba(255, 255, 255, 0.95) 70%)',
      accent1: 'rgba(16, 185, 129, 0.12)',
      accent2: 'rgba(14, 165, 233, 0.12)',
    },
    roseGold: {
      name: 'Rose Gold Glow',
      bg: 'radial-gradient(ellipse at 50% 20%, rgba(255, 228, 230, 0.45) 0%, rgba(255, 255, 255, 0.95) 70%)',
      accent1: 'rgba(244, 63, 94, 0.15)',
      accent2: 'rgba(251, 146, 60, 0.12)',
    },
  };

  const current = moods[activeMood] || moods.champagne;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      {/* Dynamic luxury gradient background */}
      <div
        className="absolute inset-0 transition-all duration-700"
        style={{ background: current.bg }}
      />

      {/* Floating subtle ambient orbs */}
      <motion.div
        animate={{
          x: [0, 20, 0],
          y: [0, -20, 0],
          scale: [1, 1.08, 1],
        }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl pointer-events-none"
        style={{ background: current.accent1 }}
      />

      <motion.div
        animate={{
          x: [0, -25, 0],
          y: [0, 25, 0],
          scale: [1, 1.06, 1],
        }}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-1/4 right-1/4 w-[420px] h-[420px] rounded-full blur-3xl pointer-events-none"
        style={{ background: current.accent2 }}
      />

    </div>
  );
}
