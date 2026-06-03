'use strict';

const { Router } = require('express');
const DashboardController = require('../controllers/dashboard.controller');

const router = Router();

router.get('/metrics',   DashboardController.getMetrics);
router.get('/alerts',    DashboardController.getActiveAlerts);
router.get('/timeline',  DashboardController.getComplianceTimeline);

module.exports = router;
