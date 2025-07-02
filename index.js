const express = require('express');
const cors = require('cors');
const dbconnection = require('./src/config/db');
require('dotenv').config();
const helmet = require('helmet');
const authMiddleware = require('./src/middlewares/auth.middleware');
const errorMiddleware = require('./src/middlewares/error.middleware');
const limitter = require('./src/config/rateLimitter');
const { auditLog } = require('./src/middlewares/log.middleware');
require('./src/jobs/booking');
require('./src/middlewares/redis.middleware');

// Router paths
const userRouter = require('./src/routes/user.router');
const bookingRouter = require('./src/routes/bookingsRoute');
const carRouter = require('./src/routes/carsRoute');
const cookieParser = require('cookie-parser');
const { createCsrfToken, hashToken } = require('./src/utils/helper');

const PORT = process.env.PORT || 8000;
const app = express();
app.use(helmet());
app.use(cookieParser());
app.use(express.json());
app.use(
  cors({
    origin: ['http://localhost:3000'],
    methods: ['GET', 'POST', 'DELETE', 'PUT'],
    credentials: true
  })
);
app.use(limitter);
dbconnection();
app.use(auditLog);

app.get('/', (_, res) => {
  res.send('Hello World!');
});

app.use('/api/user/', userRouter);

app.get('/api/csrf-token', authMiddleware, (req, res) => {
  try {
    const csrfRaw = createCsrfToken(); // random UUID or crypto
    const csrfHashed = hashToken(csrfRaw);

    // Save hashed in cookie
    res.cookie('csrf_token', csrfHashed, {
      httpOnly: false, // frontend must read
      sameSite: 'Strict',
      secure: true,
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    // Send raw token to client
    return res.status(200).json({ success: true, data: csrfRaw });
  } catch (e) {
    return res.status(400).json({ success: false, data: e });
  }
});

app.use('/api/bookings/', bookingRouter);
app.use(authMiddleware);
app.use('/api/cars/', carRouter);

app.use((_, res) => {
  res.status(404).json({ msg: 'Route Not Found' });
});

app.use(errorMiddleware);
app.listen(PORT, () => console.log(`server started in ${PORT}`));
