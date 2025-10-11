const express = require('express');
const router = express.Router();
const { getReportsSummary, downloadReport } = require('../controllers/reports.controller');
const auth = require('../middlewares/auth.middleware');
const authorizedRoles = require('../middlewares/role.middleware');

router.get('/', auth, authorizedRoles('admin'), getReportsSummary);
router.get('/:type/download', auth, authorizedRoles('admin'), downloadReport);

module.exports = router;
