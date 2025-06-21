# Car Rental Application – Node.js + Express + MongoDB

This is a Car Rental Web Application built using **Node.js**, **Express**, **MongoDB**, and follows the **MVC layered architecture** with clean service separation.

---

## 🏗️ Architecture Used: MVC Layered with Service Abstraction

### ✅ Why MVC?
The application follows a **Model-View-Controller (MVC)** layered structure with **service layers** for business logic, ensuring:
- **Separation of concerns** between routes, logic, and data

### ✅ Folder Structure Overview:
```
src/
├── models/         # Mongoose schemas
├── controllers/    # Route handlers (no logic)
├── services/       # Business logic (availability, pricing, etc.)
├── routes/         # Express route definitions
├── middlewares/    # Auth, validation, error handlers
├── config/         # Database and env configuration
├── jobs/           # Cron jobs (e.g., cancel unpaid bookings)
├── utils/          # Helper functions (e.g., date validation)
├── uploads/        # Temporary local files (dev only)
├── logs/           # Winston-based log files
app.js              # Entry point
.env                # Environment config
```

---

## ⚙️ Core Features

- 🔐 **JWT Authentication**
- 👤 User + Admin roles
- 🚗 Car listing, search, filter
- 📅 Car availability logic
- 🧮 Dynamic pricing based on days
- 🛒 Booking system (with conflict checks)
- 💳 Razorpay integration
- 📆 Auto-cancel unpaid bookings (via `node-cron`)
- 🖼️ Image upload (S3-ready)
- 📊 Admin dashboard routes
- 🧪 Unit-tested architecture (Jest-ready)

---

## 🔐 Security Best Practices Followed

- Bcrypt for password hashing
- JWT for secure token-based authentication
- Helmet + CORS + Rate-limiting
- Input validation using `joi`
- Centralized error handling
- Environment variables using `.env`

---

## 💳 Booking & Payment Flow

1. User selects a car and rental dates
2. System checks car availability (prevents double-booking)
3. Calculates total amount
4. Creates a **pending** booking
5. User pays via payment gateway
6. On payment success:
   - Booking marked as **paid**
   - Car marked unavailable for those dates
7. If unpaid after X minutes → booking auto-cancelled via `node-cron`

---

## 🌐 Tech Stack

| Layer        | Technology                |
|--------------|---------------------------|
| Backend      | Node.js + Express         |
| Database     | MongoDB (Mongoose)        |
| Auth         | JWT + bcrypt              |
| File Upload  | Multer (S3 Ready)         |
| Scheduler    | Node-Cron                 |
| Payment      | Razorpay                  |
| Deployment   | Docker / Railway / Render |
| Logging      | Winston                   |
| Testing      | Jest + Supertest          |

---

## 🐳 Deployment Instructions

1. Clone the repo:
   ```bash
   git clone https://github.com/your-username/car-rental-app
   cd car-rental-app
   ```

2. Create `.env`:
   ```
   MONGO_URI=
   JWT_SECRET=
   RAZORPAY_KEY_ID=
   RAZORPAY_SECRET=
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Start server (dev mode):
   ```bash
   npm run dev
   ```

5. Run Docker (optional):
   ```bash
   docker build -t car-rental-app .
   docker run -p 3000:3000 car-rental-app
   ```

---

## ✅ Coming Soon

- Admin UI Dashboard (React)
- Rating & Reviews for cars
- Corporate booking support
- Email/SMS notifications via queue
---