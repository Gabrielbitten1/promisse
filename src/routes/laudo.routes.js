'use strict';

const { Router } = require('express');
const LaudoController = require('../controllers/laudo.controller');
const { authorize } = require('../middlewares/auth.middleware');
const { rateLimiterAI } = require('../config/security');

const router = Router();

router.get('/',              LaudoController.list);
router.get('/:id',           LaudoController.findById);
router.post('/',             authorize('SUPER_ADMIN','ADMIN_EMPRESA','GESTOR_SEGURANCA','TECNICO_SST'), LaudoController.create);
router.patch('/:id/status',  authorize('SUPER_ADMIN','ADMIN_EMPRESA','GESTOR_SEGURANCA'), LaudoController.updateStatus);
router.post('/:id/generate', authorize('SUPER_ADMIN','ADMIN_EMPRESA','GESTOR_SEGURANCA','TECNICO_SST'), rateLimiterAI, LaudoController.generateWithAI);

module.exports = router;
