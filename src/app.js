const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');

const authMiddleware = require('./middlewares/auth.middleware');
const errorMiddleware = require('./middlewares/error.middleware');
const limitter = require('./config/rateLimitter');
const { auditLog } = require('./middlewares/log.middleware');
const userRouter = require('./routes/user.route');
const bookingRouter = require('./routes/bookings.route');
const carRouter = require('./routes/cars.route');
const attachmentRouter = require('./routes/attachment.route');
const csrfRouter = require('./routes/csrf.route');
const imageViewRouter = require('./routes/image.route');
const paymentRouter = require('./routes/payment.route');
const offersRouter = require('./routes/offers.route');
const exploreRouter = require('./routes/explore.route');
const reportsRouter = require('./routes/reports.routes');

const app = express();

app.use(
  helmet({
    crossOriginResourcePolicy: false
  })
);
app.use(cookieParser());
app.use(express.json());
app.use(
  cors({
    origin: (process.env.CORS_ORIGINS || 'http://localhost:3000')
      .split(',')
      .map((origin) => origin.trim()),
    methods: ['GET', 'POST', 'DELETE', 'PUT', 'PATCH'],
    credentials: true
  })
);
app.use(limitter);
app.use(auditLog);

app.get('/', (_, res) => {
  res.send('Hello World!');
});

app.use('/api/v1/user', userRouter);
app.use('/api/v1/image', imageViewRouter);
app.use('/api/v1/bookings', bookingRouter);
app.use('/api/v1/explore', exploreRouter);
app.use(authMiddleware);
app.use('/api/v1/csrf', csrfRouter);
app.use('/api/v1/cars', carRouter);
app.use('/api/v1/attachment', attachmentRouter);
app.use('/api/v1/payment', paymentRouter);
app.use('/api/v1/offers', offersRouter);
app.use('/api/v1/admin/reports', reportsRouter);

app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} Not Found` });
});

app.use(errorMiddleware);

module.exports = app;
