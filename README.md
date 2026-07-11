# 🛒 EliteMart

> A full-stack e-commerce platform inspired by Flipkart, built using the MERN stack with secure authentication, product management, shopping cart, order processing, and cloud-based image storage.

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Bootstrap](https://img.shields.io/badge/Bootstrap-7952B3?style=for-the-badge&logo=bootstrap&logoColor=white)
![Cloudinary](https://img.shields.io/badge/Cloudinary-3448C5?style=for-the-badge)

---

## 📌 Overview

EliteMart is a feature-rich full-stack e-commerce application that simulates a modern online shopping platform.

The application allows users to browse products, create accounts, manage carts, place orders, upload product images, and securely authenticate using session-based authentication.

The project focuses on backend architecture, authentication, database design, and scalable CRUD operations.

---

## ✨ Features

### 👤 User Features

- User Registration & Login
- Secure Authentication
- Browse Products
- Product Search
- Category-wise Products
- Shopping Cart
- Checkout Flow
- Order History
- Responsive UI

### 🛍️ Product Management

- Add Products
- Edit Products
- Delete Products
- Product Image Upload
- Cloudinary Image Storage
- Product Categories
- Product Details Page

### 🔒 Authentication & Security

- Passport.js Authentication
- Session Management
- Password Hashing
- Authorization Middleware
- Protected Routes
- Environment Variables

### ☁️ Cloud Features

- Cloudinary Integration
- MongoDB Atlas Database
- Image Storage
- Secure Configuration using .env

---

## 🏗️ Tech Stack

### Frontend

- HTML
- CSS
- Bootstrap
- EJS

### Backend

- Node.js
- Express.js

### Database

- MongoDB Atlas
- Mongoose

### Authentication

- Passport.js
- Passport Local
- Express Session

### Cloud Services

- Cloudinary

### Other Packages

- Multer
- dotenv
- connect-flash
- method-override
- express-validator

---

## 📂 Project Structure

```
EliteMart/
│
├── controllers/
├── models/
├── routes/
├── middleware/
├── views/
├── public/
├── utils/
├── app.js
├── package.json
└── README.md
```

---

## ⚙️ Installation

Clone the repository

```bash
git clone https://github.com/V-Vibhuvan/elite_mart.git
```

Move into the project

```bash
cd elite_mart
```

Install dependencies

```bash
npm install
```

Create a `.env` file

```env
MONGO_URI=

CLOUDINARY_CLOUD_NAME=

CLOUDINARY_KEY=

CLOUDINARY_SECRET=

SESSION_SECRET=
```

Run the project

```bash
npm start
```

---

## 📸 Screenshots

Add screenshots here.

Example:

```
screenshots/

Home.png

Product.png

Cart.png

Login.png

Admin.png
```

---

## 🚀 Future Improvements

- Razorpay / Stripe Payment Integration
- Wishlist
- Product Reviews & Ratings
- Admin Dashboard
- Sales Analytics
- Order Tracking
- Email Notifications
- JWT Authentication

---

## 📚 Learning Outcomes

This project helped me gain practical experience with:

- RESTful API Development
- MVC Architecture
- Authentication & Authorization
- MongoDB Data Modeling
- Cloudinary Integration
- File Upload Handling
- Session Management
- Backend Development using Express
- Database CRUD Operations

---

## 👨‍💻 Author

**V Vibhuvan**

- B.Tech Computer Science Engineering
- MERN Stack Developer
- AI & Backend Enthusiast

---

## ⭐ Support

If you found this project useful, consider giving it a ⭐ on GitHub.
