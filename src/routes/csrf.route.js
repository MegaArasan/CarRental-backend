const express = require('express');
const { getToken } = require('../controllers/csrf.controller');

const router = express.Router();

router.get('/', getToken);

module.exports = router;
