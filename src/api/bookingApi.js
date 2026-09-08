// export async function bookTable(data) {
//   // Simulate network request
//   return new Promise((resolve, reject) => {
//     setTimeout(() => {
//       // Basic mock validation
//       if (
//         !data.fullName ||
//         !data.email ||
//         !data.phone ||
//         !data.date ||
//         !data.time ||
//         !data.guests
//       ) {
//         reject(new Error("Missing required fields."));
//         return;
//       }

//       const bookingId = `RS-${new Date().getFullYear()}-${Math.floor(
//         1000 + Math.random() * 9000
//       )}`;

//       const newBooking = {
//         ...data,
//         bookingId,
//         createdAt: new Date().toISOString(),
//       };

//       // Save to localStorage for Admin portal
//       if (typeof window !== "undefined") {
//         const existing = localStorage.getItem("rs_admin_bookings");

//         const bookings = existing ? JSON.parse(existing) : [];

//         bookings.push(newBooking);

//         localStorage.setItem(
//           "rs_admin_bookings",
//           JSON.stringify(bookings)
//         );
//       }

//       resolve({
//         success: true,
//         bookingId,
//         message: "Table Reserved Successfully!",
//       });
//     }, 1500);
//   });
// }

// export function getStoredBookings() {
//   if (typeof window !== "undefined") {
//     const existing = localStorage.getItem("rs_admin_bookings");

//     if (existing) {
//       return JSON.parse(existing);
//     }
//   }

//   return [];
// }

// export function deleteStoredBooking(bookingId) {
//   if (typeof window !== "undefined") {
//     const existing = localStorage.getItem("rs_admin_bookings");

//     if (existing) {
//       let bookings = JSON.parse(existing);

//       bookings = bookings.filter(
//         (b) => b.bookingId !== bookingId
//       );

//       localStorage.setItem(
//         "rs_admin_bookings",
//         JSON.stringify(bookings)
//       );
//     }
//   }
// }

const API_URL = "http://localhost:8050";


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

  const response = await fetch(`${API_URL}/read`);

  if (!response.ok) {
    throw new Error("Failed to fetch bookings.");
  }

  return await response.json();
}


// GET SINGLE BOOKING
export async function getBookingById(id) {

  const response = await fetch(`${API_URL}/read/${id}`);

  if (!response.ok) {
    throw new Error("Failed to fetch booking.");
  }

  return await response.json();
}


// DELETE BOOKING
export async function deleteStoredBooking(id) {

  const response = await fetch(`${API_URL}/delete/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete booking.");
  }

  return await response.text();
}