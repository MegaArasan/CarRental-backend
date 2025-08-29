const express = require('express');
const router = express.Router();
const { addBooking, getBooking, confirmBooking } = require('../controllers/booking.controller');
const auth = require('../middlewares/auth.middleware');
const csrf = require('../middlewares/verifyCsrf');
const verifySignature = require('../middlewares/verifySignature');
const { validate, validateQuery } = require('../middlewares/joi.middleware');
const { bookingSchema, getBookingQuerySchema } = require('../validations/booking.schema');

router.post('/bookcar', auth, csrf, validate(bookingSchema), addBooking);

router.get('/getallbookings', auth, csrf, validateQuery(getBookingQuerySchema), getBooking);

router.post('/verify', verifySignature, confirmBooking);

module.exports = router;
