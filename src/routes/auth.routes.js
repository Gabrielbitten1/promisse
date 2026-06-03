'use strict';

const { Router } = require('express');
const { rateLimiterAuth } = require('../config/security');
const AuthController = require('../controllers/auth.controller');
const validate = require('../middlewares/validate.middleware');
const { loginSchema, refreshSchema } = require('../validators/auth.validator');

const router = Router();

router.post('/login',   rateLimiterAuth, validate(loginSchema),   AuthController.login);
router.post('/refresh', rateLimiterAuth, validate(refreshSchema), AuthController.refresh);
router.post('/logout',  AuthController.logout);

module.exports = router;
