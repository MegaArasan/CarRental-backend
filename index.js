const express = require('express');
const cors = require('cors');
const { connectdb } = require('./src/config/db');
require('dotenv').config();
const helmet = require('helmet');
const authMiddleware = require('./src/middlewares/auth.middleware');
const errorMiddleware = require('./src/middlewares/error.middleware');
const limitter = require('./src/config/rateLimitter');
const { auditLog } = require('./src/middlewares/log.middleware');
require('./src/jobs/booking');
require('./src/middlewares/redis.middleware');

// Router paths
const userRouter = require('./src/routes/user.route');
const bookingRouter = require('./src/routes/bookings.route');
const carRouter = require('./src/routes/cars.route');
const attachmentRouter = require('./src/routes/attachment.route');
const csrfRouter = require('./src/routes/csrf.route');

const cookieParser = require('cookie-parser');

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
connectdb();
app.use(auditLog);

app.get('/', (_, res) => {
  res.send('Hello World!');
});

app.use('/api/v1/user', userRouter);

app.use('/api/v1/bookings', bookingRouter);
app.use(authMiddleware);
app.use('/api/v1/csrf', csrfRouter);
app.use('/api/v1/cars', carRouter);
app.use('/api/v1/attachment', attachmentRouter);

app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} Not Found` });
});

app.use(errorMiddleware);
app.listen(PORT, () => console.log(`server started in ${PORT}`));
