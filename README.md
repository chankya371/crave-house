# 🍔 Crave House

A modern **Full Stack Food Ordering & Delivery Platform** built using **React.js, Node.js, Express.js, MongoDB, Docker, Stripe, and OpenStreetMap**.

Crave House enables customers to browse food items, place orders, make secure online payments, manage their profiles, and select delivery locations using interactive maps. The platform also provides a powerful **Admin Dashboard** to manage users, categories, products, and orders efficiently.

---

# 🌟 Features

## 👤 Customer Features

### Authentication

* User Registration
* OTP Email Verification
* Login & Logout
* JWT Authentication
* Protected Routes

### Food Ordering

* Browse Categories
* Search Food Items
* View Food Details
* Add to Cart
* Update Quantity
* Remove from Cart
* Wishlist (Favorites)

### User Profile

* Update Profile
* Manage Delivery Addresses
* View Order History
* Track Order Status

### Location Services

* Detect Current Location
* Select Delivery Location from Map
* Reverse Geocoding using OpenStreetMap
* Interactive Map using React Leaflet

### Secure Payments

* Stripe Payment Gateway
* Payment Intent API
* Online Payment
* Cash on Delivery (Optional)

---

## 🛠 Admin Dashboard

### Dashboard

* Total Users
* Total Orders
* Total Categories
* Total Products
* Order Analytics

### Category Management

* Add Category
* Update Category
* Delete Category

### Product Management

* Add Food Items
* Upload Multiple Images
* Edit Products
* Delete Products

### Order Management

* View Customer Orders
* Update Order Status
* Manage Delivery Progress

### User Management

* View Registered Users
* Manage User Accounts

---

# 🚀 Tech Stack

## Frontend

* React.js
* React Router DOM
* Axios
* React Toastify
* React Icons
* React Leaflet
* CSS3

## Backend

* Node.js
* Express.js
* JWT Authentication
* Multer
* Nodemailer
* Bcrypt.js

## Database

* MongoDB
* Mongoose

## Payment

* Stripe Payment Gateway

## Maps

* OpenStreetMap
* Nominatim API
* React Leaflet

## DevOps

* Docker
* Docker Compose
* Environment Variables (.env)

---

# 📂 Project Structure

```
crave-house/
│
├── backend/
│
├── food-frontend/
│
├── admin-frontend/
│
├── docker-compose.yml
│
├── .gitignore
│
└── README.md
```

---

# ⚙️ Installation

## 1️⃣ Clone Repository

```bash
git clone https://github.com/chankya371/crave-house.git

cd crave-house
```

---

## 2️⃣ Backend Setup

```bash
cd backend

npm install

npm run dev
```

---

## 3️⃣ Customer Frontend

```bash
cd food-frontend

npm install

npm start
```

---

## 4️⃣ Admin Frontend

```bash
cd admin-frontend

npm install

npm start
```

---

# 🐳 Docker Setup

Start all services using Docker Compose.

```bash
docker-compose up --build
```

To stop containers:

```bash
docker-compose down
```

---

# 🔐 Environment Variables

Create a **.env** file inside the **backend** directory.

```env
PORT=5000

MONGO_URI=

JWT_SECRET=

STRIPE_SECRET_KEY=

EMAIL_USER=

EMAIL_PASSWORD=

CLIENT_URL=http://localhost:3000
```

For Frontend:

```env
REACT_APP_API_URL=http://localhost:5000/api
```

---

# 📷 Image Upload

* Product Image Upload
* Category Image Upload
* Multer Storage
* Static Image Serving

---

# 🔄 Application Workflow

1. User creates an account.
2. Email OTP verification.
3. User logs in securely.
4. Browse categories and food items.
5. Add products to cart.
6. Select delivery address.
7. Choose delivery location on map.
8. Complete payment using Stripe.
9. Order stored in MongoDB.
10. Admin updates order status.
11. Customer tracks order history.

---

# 🔒 Security Features

* JWT Authentication
* Password Hashing (bcrypt)
* Protected Routes
* Admin Authorization
* Secure Stripe Payment
* Environment Variables
* Input Validation

---

# 📈 Future Improvements

* Google Maps Integration
* Real-Time Order Tracking
* Live Delivery Tracking
* Push Notifications
* AI Food Recommendation
* Restaurant Partner Portal
* Coupons & Discounts
* Ratings & Reviews
* PWA Support
* Multi-Restaurant Support

---

# 💻 Tech Highlights

* Full Stack MERN Application
* RESTful APIs
* Dockerized Backend & Frontend
* Responsive UI
* Role-Based Authentication
* Secure Payment Integration
* Location-Based Delivery
* Image Upload with Multer
* MongoDB Relationships using Mongoose
* Clean Project Structure

---

# 👨‍💻 Developer

**Vijay Sharma**

**Full Stack MERN Developer**

### Skills

* React.js
* Node.js
* Express.js
* MongoDB
* Docker
* JavaScript
* REST APIs
* Stripe Integration
* JWT Authentication

---

## ⭐ If you like this project, don't forget to Star the repository!
