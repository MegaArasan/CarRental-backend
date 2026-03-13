const express = require('express');
const upload = require('../middlewares/multer.middleware');
const { add, get } = require('../controllers/attachment.controller');
const { validate } = require('../middlewares/joi.middleware');
const { addSchema } = require('../validations/attachment.schema');

const router = express.Router();

router.post('/add', upload.any(), validate(addSchema), add);
router.get('/get', get);

module.exports = router;
