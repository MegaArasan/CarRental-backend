const express = require('express');
const router = express.Router();
const {
  addBooking,
  getBooking,
  confirmBooking
} = require('../../src/controllers/booking.controller');
const auth = require('../middlewares/auth.middleware');
const verifySignature = require('../middlewares/verifySignature');

router.post('/bookcar', auth, addBooking);

router.get('/getallbookings', auth, getBooking);

router.post('/verify', verifySignature, confirmBooking);

module.exports = router;
