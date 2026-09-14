# 🍽️ Restaurant Platform — Frontend

> **A modern restaurant ordering and table pre-booking platform built with React and Vite.**

The frontend provides a complete customer-facing restaurant experience where users can explore the menu, add food items to a cart, customize their food requirements, and pre-book a table before visiting the restaurant.

The application also provides an admin-facing interface for managing incoming customer bookings and orders through a dedicated admin portal.

---

## ✨ Overview

This project is designed to simulate a real-world restaurant platform rather than a simple static restaurant website.

Customers can:

* Browse the restaurant menu
* Explore food categories and item details
* Add food items to a shopping cart
* Modify cart quantities
* Submit customized food requests
* Pre-book a restaurant table
* Combine food orders with their table booking
* Receive booking confirmation
* Provide special instructions for their order

The platform does **not process online payments**.

Customers can reserve their table and submit their food order in advance, while the actual payment is completed at the restaurant.

---

## 🚀 Key Features

### 👤 Customer Features

* 🏠 Modern restaurant landing page
* 📖 Dynamic menu browsing
* 🍛 Food categorization
* 🛒 Add-to-cart functionality
* ➕ Increase/decrease cart quantity
* 🗑️ Remove items from cart
* 📝 Customized food requests
* 📅 Table pre-booking
* 👥 Guest selection
* 🪑 Table preference selection
* 📞 Customer contact information
* 💬 Special requests/instructions
* 📦 Pre-order food along with table booking
* ✅ Booking confirmation with booking ID

---

## 🛒 Cart & Pre-Order Flow

The customer can select food items before visiting the restaurant.

```text
Browse Menu
     │
     ▼
Select Food
     │
     ▼
Add to Cart
     │
     ▼
Review Cart
     │
     ├── Update Quantity
     ├── Remove Items
     └── Add Special Request
     │
     ▼
Book Table
     │
     ▼
Submit Booking
     │
     ▼
Booking Confirmation
```

The customer can therefore prepare their food order while making their table reservation.

### 💳 Payment

Online payment is intentionally **not implemented**.

```text
Customer
   │
   ├── Table Pre-booking ──► ✅
   │
   ├── Food Pre-order ─────► ✅
   │
   └── Online Payment ─────► ❌
                              │
                              ▼
                     Payment at Restaurant
```

---

## 🧑‍💼 Admin Portal

The frontend includes a dedicated admin portal through which restaurant administrators can manage incoming customer requests.

### Admin capabilities

* 🔐 Admin login
* 📋 View incoming bookings/orders
* 👀 View customer booking details
* 🍽️ View ordered food items
* 📝 View customized food requests
* ✏️ Update booking/order information
* 🗑️ Delete booking records
* 📊 Manage restaurant booking data

The admin portal communicates with the Spring Boot backend through REST APIs.

---

## 🏗️ Application Architecture

```text
                    CUSTOMER
                       │
                       ▼
              ┌─────────────────┐
              │   React Frontend │
              └────────┬────────┘
                       │
              REST API Requests
                       │
                       ▼
              ┌─────────────────┐
              │  Spring Boot API │
              └────────┬────────┘
                       │
                       ▼
                 MySQL Database
```

For the admin flow:

```text
ADMIN
  │
  ▼
Admin Login
  │
  ▼
React Admin Portal
  │
  ▼
Spring Boot REST API
  │
  ▼
Authentication / Authorization
  │
  ▼
Booking & Order Management
  │
  ▼
MySQL
```

---

## 🛠️ Tech Stack

| Technology   | Purpose                     |
| ------------ | --------------------------- |
| React        | Frontend UI                 |
| Vite         | Development & build tooling |
| JavaScript   | Application logic           |
| Tailwind CSS | Styling & responsive UI     |
| React Router | Client-side navigation      |
| Lucide React | UI icons                    |
| Motion       | UI animations               |
| REST APIs    | Backend communication       |
| Spring Boot  | Backend                     |
| MySQL        | Database                    |

---

## 📂 Frontend Structure

```text
frontend/
│
├── public/
│
├── src/
│   ├── api/
│   │   ├── adminApi.js
│   │   ├── contactApi.js
│   │   └── bookingApi.js
│   │
│   ├── components/
│   │   ├── AdminDashboard.jsx
│   │   ├── AdminLogin.jsx
│   │   ├── Contact.jsx
│   │   ├── BookingSection.jsx
│   │   └── ...
│   │
│   ├── pages/
│   │
│   ├── assets/
│   │
│   ├── App.jsx
│   └── main.jsx
│
├── package.json
├── vite.config.js
└── README.md
```

---

## 🔌 Backend Integration

The frontend communicates with the Spring Boot backend using REST APIs.

Example API communication:

```javascript
fetch(`${API_URL}/api/bookings`, {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify(bookingData)
});
```

The frontend API layer keeps backend communication separated from UI components.

This makes the application easier to maintain and allows API logic to evolve independently from the UI.

---

## 🎨 UI Design

The interface follows a premium Indian restaurant visual style with:

* Cream-based backgrounds
* Charcoal typography
* Saffron accents
* Burgundy highlights
* Gold details
* Serif headings
* Responsive layouts
* Smooth animations

The goal is to combine a traditional Indian restaurant aesthetic with a modern web application experience.

---

## ⚙️ Environment Setup

### Prerequisites

* Node.js
* npm
* Running Spring Boot backend

### Installation

```bash
git clone <repository-url>

cd frontend

npm install
```

### Start Development Server

```bash
npm run dev
```

The frontend will normally be available at:

```text
http://localhost:5173
```

---

## 🔗 Backend Configuration

Configure the frontend API base URL according to the backend environment.

Example:

```env
VITE_API_URL=http://localhost:8050
```

For production, replace the local backend URL with the deployed backend URL.

---

## 📱 Responsive Design

The application is designed to work across:

* Desktop
* Laptop
* Tablet
* Mobile devices

---

## 🔮 Future Improvements

Potential improvements include:

* Online payment integration
* Real-time order status
* Customer order history
* Table availability calendar
* Restaurant analytics dashboard
* Push notifications
* Customer authentication
* Role-based admin permissions
* Image optimization
* Production deployment

---

## 👨‍💻 Project Purpose

This project was built to understand how a real-world frontend communicates with a Spring Boot backend and how customer-facing functionality can be connected with an administrative management system.

It focuses on practical full-stack development concepts such as:

* REST API integration
* State management
* CRUD-based workflows
* Form handling
* Cart functionality
* Authentication
* Admin dashboards
* Backend integration
* Responsive UI development

---

## 📌 Status

**Project Status:** 🚧 Actively developed / Feature complete for core functionality

The core restaurant booking, cart, admin management, and backend integration features are implemented.

---

## 📄 License

This project is created for learning and portfolio purposes.
