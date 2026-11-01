'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import API_URL from '../api/apiConfig';

const BASE_API = API_URL ? API_URL.replace(/\/$/, '') : '';

const TableHoldContext = createContext(undefined);

export function TableHoldProvider({ children }) {
  // 1. Session Isolation: Unique session ID per browser tab (stored in sessionStorage)
  const [sessionId, setSessionId] = useState(() => {
    if (typeof window === 'undefined') return '';
    let sid = sessionStorage.getItem('royal_spices_tab_session_id');
    if (!sid) {
      sid = `tab_${Math.random().toString(36).substring(2, 9)}_${Date.now()}`;
      sessionStorage.setItem('royal_spices_tab_session_id', sid);
    }
    return sid;
  });

  // 2. Active Hold State (persisted in sessionStorage so form close/refresh keeps the timer)
  const [activeHold, setActiveHoldState] = useState(() => {
    if (typeof window === 'undefined') return null;
    try {
      const saved = sessionStorage.getItem('royal_spices_active_hold');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.expiresAt && parsed.expiresAt > Date.now()) {
          return parsed;
        } else {
          sessionStorage.removeItem('royal_spices_active_hold');
        }
      }
    } catch (e) {}
    return null;
  });

  // 3. Selected Table & Booking Modal Visibility
  const [selectedTable, setSelectedTable] = useState(() => {
    if (typeof window === 'undefined') return null;
    try {
      const saved = sessionStorage.getItem('royal_spices_selected_table');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return null;
  });

  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [bookingStep, setBookingStep] = useState('SELECT_TABLE'); // 'SELECT_TABLE' | 'CART_REVIEW' | 'CONFIRMED'

  const [formData, setFormData] = useState(() => ({
    date: new Date().toISOString().split('T')[0],
    timeSlot: '11:45 am',
    guestCount: 2,
    customerName: 'Alex Morgan',
    customerEmail: 'alex.morgan@example.com',
    customerPhone: '+91 98765 43210',
    specialRequests: '',
  }));

  // Update activeHold in both state and sessionStorage
  const setActiveHold = useCallback((hold) => {
    setActiveHoldState(hold);
    if (hold) {
      sessionStorage.setItem('royal_spices_active_hold', JSON.stringify(hold));
    } else {
      sessionStorage.removeItem('royal_spices_active_hold');
    }
  }, []);

  // Update selectedTable and persist
  const updateSelectedTable = useCallback((table) => {
    setSelectedTable(table);
    if (table) {
      sessionStorage.setItem('royal_spices_selected_table', JSON.stringify(table));
    } else {
      sessionStorage.removeItem('royal_spices_selected_table');
    }
  }, []);

  // Release hold on backend and clear local state
  const clearActiveHold = useCallback(async () => {
    if (activeHold && activeHold.holdToken) {
      try {
        await fetch(`${BASE_API}/api/holds?holdToken=${encodeURIComponent(activeHold.holdToken)}`, {
          method: 'DELETE',
        });
      } catch (e) {}
    }
    setActiveHoldState(null);
    sessionStorage.removeItem('royal_spices_active_hold');
  }, [activeHold]);

  // Open booking modal
  const openBooking = useCallback((step = null) => {
    if (step) setBookingStep(step);
    setIsBookingOpen(true);
  }, []);

  // Close booking modal
  const closeBooking = useCallback(() => {
    setIsBookingOpen(false);
  }, []);

  return (
    <TableHoldContext.Provider
      value={{
        sessionId,
        activeHold,
        setActiveHold,
        clearActiveHold,
        selectedTable,
        setSelectedTable: updateSelectedTable,
        isBookingOpen,
        setIsBookingOpen,
        openBooking,
        closeBooking,
        bookingStep,
        setBookingStep,
        formData,
        setFormData,
      }}
    >
      {children}
    </TableHoldContext.Provider>
  );
}

export function useTableHold() {
  const context = useContext(TableHoldContext);
  if (!context) {
    throw new Error('useTableHold must be used within a TableHoldProvider');
  }
  return context;
}
