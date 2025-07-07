const express = require('express');
const upload = require('../middlewares/multer.middleware');
const { add, get } = require('../controllers/attachment.controller');

const router = express.Router();

router.post('/add', upload.any(), add);
router.get('/get', get);

module.exports = router;
