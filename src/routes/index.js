'use strict';

const { Router } = require('express');

const authRoutes       = require('./auth.routes');
const empresaRoutes    = require('./empresa.routes');
const unidadeRoutes    = require('./unidade.routes');
const maquinaRoutes    = require('./maquina.routes');
const riscoRoutes      = require('./risco.routes');
const laudoRoutes      = require('./laudo.routes');
const dashboardRoutes  = require('./dashboard.routes');
const aiRoutes         = require('./ai.routes');

const { verifyToken } = require('../middlewares/auth.middleware');

const router = Router();

// Public
router.use('/auth', authRoutes);

// Protected
router.use(verifyToken);
router.use('/empresas',   empresaRoutes);
router.use('/unidades',   unidadeRoutes);
router.use('/maquinas',   maquinaRoutes);
router.use('/riscos',     riscoRoutes);
router.use('/laudos',     laudoRoutes);
router.use('/dashboard',  dashboardRoutes);
router.use('/ai',         aiRoutes);

module.exports = router;
