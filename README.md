# 🚗 Car Rental Backend API

A full-featured Node.js backend for a car rental platform. Supports image uploads via GridFS, secure cookie-based sessions (JWT + CSRF), dynamic filtering, role-based access, and optimized MongoDB queries.

## 📁 Project Structure

```
├── controllers/
├── models/
├── routes/
├── services/
├── middlewares/
├── utils/
├── uploads/ (GridFS files managed in MongoDB)
├── config/
├── validations/
├── .env
├── server.js
```

---

## 🚀 Features

- 🔐 **Secure Auth:** JWT-based login with CSRF protection via cookies.
- 🧠 **Role Access:** Middleware support for admin/user authorization.
- ☁️ **GridFS Uploads:** File + thumbnail handling with linking to models.
- 🔍 **Pagination & Filters:** Dynamic filters for car listings.
- 🛠️ **Validation:** Joi-based schema validation.
- 📸 **Image API:** Serve images via `/api/v1/image/:id`.

---

## ⚙️ Setup Instructions

### 1. Clone the repo

```bash
git clone https://github.com/your-username/car-rental-api.git
cd car-rental-api
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure `.env`

```env
PORT=8000
MONGO_URI=mongodb://localhost:27017/car-rental
JWT_SECRET=your_jwt_secret
BASE_URL=http://localhost:8000
NODE_ENV=development
```

### 4. Start the server

```bash
# Dev
npm run dev

# Prod
npm start
```

---

## 🛡️ Security

- JWT token in **httpOnly** cookie.
- CSRF token exposed via `csrf_token` cookie for frontend use.
- Helmet for HTTP headers.
- Rate limiter on auth endpoints (optional).

---

## 🧰 Technologies Used

- **Node.js + Express**
- **MongoDB + Mongoose**
- **GridFS for file storage**
- **Joi** for request validation
- **JWT + CSRF** for auth
- **Multer** for file uploads
- **PM2** + **node-cron** for process & task management

---

## 📦 Sample `.env`

```env
# MongoDB connection string
MONGO_URL=mongodb://localhost:27017/car-rental

# Server port
PORT=8000

# JWT configuration
secret_key=yourSuperSecretKey
JWT_EXPIRES_IN=7d

# Admin email credentials (used for nodemailer or login)
MY_GMAIL=admin@example.com
CLIENT_ID=your_google_oauth_client_id
CLIENT_SECRET=your_google_oauth_client_secret
REFRESH_TOKEN=your_google_oauth_refresh_token

# Razorpay credentials (for payment integration)
RAZOR_KEY=your_razorpay_key
RAZOR_SECRET=your_razorpay_secret

# Admin login credentials
ADMIN_EMAIL=admin@example.com
ADMIN_PASS=adminPassword123

# Base URL for server (used in emails, uploads, etc.)
BASE_URL=http://localhost:8000
```

---

## 🙋‍♂️ Admin Actions

- Add/edit cars
- Link uploaded images to cars
- Set car status as active/inactive

---

## ✨ To-Do / Enhancements

- ✅ Booking module
- ✅ Payment gateway integration
- 🚧 Email notifications (bookings, status)
- 🚧 Mobile app backend support
- 🚧 Multi-user login (vendor vs customer)
