# 🍔 Crave House

Crave House is a full-stack food ordering and delivery platform built using React.js, Node.js, Express.js, MongoDB, Stripe, and OpenStreetMap.

The platform allows customers to browse restaurants, order food online, make secure payments, manage profiles, and track delivery locations. It also includes a dedicated Admin Panel for managing users, restaurants, orders, and products.

---

# 📌 Problem Statement

Traditional food ordering systems often lack centralized management, secure payment integration, and accurate delivery location handling.

Crave House solves this problem by providing:

* Online food ordering
* Secure online payments
* User authentication
* Restaurant and product management
* Location-based delivery support
* Admin dashboard for complete control

---

# 🚀 Key Features

## Customer Features

### User Authentication

* User Registration
* Login & Logout
* JWT Authentication
* Protected Routes

### Food Ordering

* Browse food items
* Search products
* Add to cart
* Remove from cart
* Update quantity

### User Profile

* Update profile information
* Manage delivery addresses
* View order history

### Location Selection

* Select current location
* Pick location from map
* Reverse geocoding using OpenStreetMap

### Payment System

* Stripe Payment Gateway
* Secure payment processing
* Payment Intent implementation

---

## Admin Features

### Dashboard

* Total Users
* Total Orders
* Total Revenue
* Analytics Overview

### Product Management

* Add Products
* Edit Products
* Delete Products

### Category Management

* Create Categories
* Update Categories
* Delete Categories

### Order Management

* View Orders
* Update Order Status
* Track Delivery Progress

### User Management

* View Registered Users
* Manage User Accounts

---

# 🛠 Tech Stack

## Frontend

* React.js
* React Router
* Axios
* React Toastify
* React Leaflet
* CSS

## Backend

* Node.js
* Express.js
* JWT Authentication
* Multer
* Nodemailer

## Database

* MongoDB
* Mongoose

## Payment Gateway

* Stripe

## Maps & Location

* OpenStreetMap
* Nominatim API
* React Leaflet

---

# 📂 Project Structure

crave-house/

├── admin-frontend/

├── food-frontend/

├── backend/

├── .gitignore

└── README.md

---

# ⚙️ Installation

## Clone Repository

git clone https://github.com/chankya371/crave-house.git

cd crave-house

---

## Backend Setup

cd backend

npm install

npm run dev

---

## Food Frontend Setup

cd food-frontend

npm install

npm run dev

---

## Admin Frontend Setup

cd admin-frontend

npm install

npm run dev

---

# 🔐 Environment Variables

Create a .env file inside backend folder.

Required variables:

PORT=

MONGO_URI=

JWT_SECRET=

STRIPE_SECRET_KEY=

EMAIL_USER=

EMAIL_PASSWORD=

---

# 🔄 Application Flow

1. User registers/login.
2. User browses food items.
3. User adds products to cart.
4. User selects delivery location.
5. User completes payment using Stripe.
6. Order is stored in MongoDB.
7. Admin manages order from dashboard.
8. User receives order updates.

---

# 📈 Future Improvements

* Real-time order tracking
* Nearby users within radius
* Push notifications
* Google Maps integration
* AI-based food recommendations
* Restaurant partner portal

---

# 👨‍💻 Developer

Vijay Sharma

Full Stack Developer

Tech Stack: React.js, Node.js, Express.js, MongoDB
