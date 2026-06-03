'use strict';

const { Router } = require('express');
const AIController = require('../controllers/ai.controller');
const { rateLimiterAI } = require('../config/security');
const { authorize } = require('../middlewares/auth.middleware');

const router = Router();

router.post('/analyze-risk',     rateLimiterAI, authorize('SUPER_ADMIN','ADMIN_EMPRESA','GESTOR_SEGURANCA','TECNICO_SST'), AIController.analyzeRisk);
router.post('/compliance-check', rateLimiterAI, AIController.complianceCheck);
router.post('/suggest-controls', rateLimiterAI, AIController.suggestControls);

module.exports = router;
