# 📚 BookBalcony – Academic Book Reselling Platform

BookBalcony is a full-stack, AI-enhanced academic book reselling platform built to simplify the resale and purchase of educational books. It provides a secure, intuitive interface for students to list, discover, and purchase books with ISBN validation, QR-based tracking, and secure Razorpay-integrated payments.



---

## 🚀 Features

- 🔐 **User Authentication** – Secure login/signup with Firebase.
- 📖 **ISBN-based Book Validation** – Validates book listings via ISBN for data accuracy.
- 💳 **Razorpay Payment Integration** – Fast and secure checkout system.
- 📦 **Real-Time Inventory System** – View and update book availability live.
- 📄 **Smart Listing Flow** – Add books with minimal steps and auto-filled metadata.
- 📊 **Dashboard Analytics (for Admin)** – Monitor active users, listings, and sales.
- 🎯 **Seamless User Experience** – Clean, mobile-responsive UI built with Tailwind CSS.
- 🔍 **Smart Search** – Find books using title, author, subject, or ISBN.
- 📎 **QR Code Tracking** – Track each transaction with a unique QR.

---

## 🛠 Tech Stack

| Frontend        | Backend            | Database      | APIs & Tools         |
|-----------------|--------------------|---------------|-----------------------|
| React.js        | Node.js, Express.js| MongoDB       | Firebase, Razorpay API|
| Tailwind CSS    | RESTful API Design |               | QR Code Generator, ISBN API |

---

## 📊 Architecture Overview

```mermaid
flowchart TD
  UI[React.js + Tailwind UI]
  UI -->|API Calls| Backend[Node.js + Express.js]
  Backend -->|CRUD| DB[MongoDB Atlas]
  Backend -->|ISBN Validation| ISBN[External ISBN API]
  Backend -->|QR Generation| QR[QR Generator]
  Backend -->|Payments| Razorpay[Payment Gateway]
