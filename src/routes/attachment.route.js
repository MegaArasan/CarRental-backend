const express = require('express');
const upload = require('../middlewares/multer.middleware');
const { add } = require('../controllers/attachment.controller');

const router = express.Router();

router.post('/add', upload.any(), add);

module.exports = router;
