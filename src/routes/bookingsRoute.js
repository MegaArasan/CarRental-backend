const express = require('express');
const router = express.Router();
const {
  addBooking,
  getBooking,
  confirmBooking
} = require('../../src/controllers/booking.controller');
const auth = require('../middlewares/auth.middleware');
const csrf = require('../middlewares/verifyCsrf');
const verifySignature = require('../middlewares/verifySignature');

router.post('/bookcar', auth, csrf, addBooking);

router.get('/getallbookings', auth, csrf, getBooking);

router.post('/verify', verifySignature, confirmBooking);

module.exports = router;
