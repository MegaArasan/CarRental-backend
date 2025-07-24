const express = require('express');
const { getImageView } = require('../controllers/image.controller');
const router = express.Router();

router.get('/:id', getImageView);

module.exports = router;
