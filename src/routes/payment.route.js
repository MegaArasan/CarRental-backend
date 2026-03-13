const express = require('express');
const { paymentHistory } = require('../controllers/payment.controller');
const { validateQuery } = require('../middlewares/joi.middleware');
const { paymentHistorySchema } = require('../validations/payment.schema');

const router = express.Router();

router.get('/history', validateQuery(paymentHistorySchema), paymentHistory);

module.exports = router;
