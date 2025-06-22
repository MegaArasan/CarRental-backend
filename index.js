const express = require('express');
const app = express();
const cors = require('cors');
const PORT = process.env.PORT || 8000;
const dbconnection = require('./src/config/db');
require('dotenv').config();
const helmet = require('helmet');
const authMiddleware = require('./src/middlewares/auth.middleware');
const errorMiddleware = require('./src/middlewares/error.middleware');
const limitter = require('./src/config/rateLimitter');
const { auditLog } = require('./src/middlewares/log.middleware');
require('./src/jobs/booking');

app.use(express.json());
app.use(helmet());
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

app.use('/api/users/', require('./src/routes/user.router'));
app.use('/api/bookings/', require('./src/routes/bookingsRoute'));
app.use(authMiddleware);
app.use('/api/cars/', require('./src/routes/carsRoute'));

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use((_, res) => {
  res.status(404).json({ msg: 'Route Not Found' });
});

app.use(errorMiddleware);
app.listen(PORT, () => console.log(`server started in ${PORT}`));
