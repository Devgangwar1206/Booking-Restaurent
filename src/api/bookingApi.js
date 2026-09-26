import API_URL from "./apiConfig";
import { authFetch } from "./authFetch";


// CREATE BOOKING
export async function bookTable(data) {

  const response = await fetch(`${API_URL}/create`, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify(data),
  });

  if (!response.ok) {

    let errorMessage = "Failed to create booking.";

    try {

      const errorData = await response.json();

      if (errorData.message) {
        errorMessage = errorData.message;
      }

    } catch (error) {
      // Ignore JSON parsing error
    }

    throw new Error(errorMessage);
  }

  const booking = await response.json();

  return {
    success: true,
    bookingId: booking.bookingId,
    message: "Table Reserved Successfully!",
  };
}


// GET ALL BOOKINGS
export async function getStoredBookings() {

  const response = await authFetch("/read", {
    method: "GET",
  });

  if (!response) {
    throw new Error("Authentication failed.");
  }

  if (!response.ok) {
    throw new Error("Failed to fetch bookings.");
  }

  return await response.json();
}


// GET SINGLE BOOKING
export async function getBookingById(id) {

  const response = await authFetch(`/read/${id}`, {
    method: "GET",
  });

  if (!response) {
    throw new Error("Authentication failed.");
  }

  if (!response.ok) {
    throw new Error("Failed to fetch booking.");
  }

  return await response.json();
}


// DELETE BOOKING
export async function deleteStoredBooking(id) {

  const response = await authFetch(`/delete/${id}`, {
    method: "DELETE",
  });

  if (!response) {
    throw new Error("Authentication failed.");
  }

  if (!response.ok) {
    throw new Error("Failed to delete booking.");
  }

  return await response.text();
}