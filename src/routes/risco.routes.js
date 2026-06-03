'use strict';

const { Router } = require('express');
const RiscoController = require('../controllers/risco.controller');
const validate = require('../middlewares/validate.middleware');
const { authorize } = require('../middlewares/auth.middleware');

const router = Router();

router.get('/',       RiscoController.list);
router.get('/:id',    RiscoController.findById);
router.post('/',      authorize('SUPER_ADMIN','ADMIN_EMPRESA','GESTOR_SEGURANCA','TECNICO_SST'), RiscoController.create);
router.put('/:id',    authorize('SUPER_ADMIN','ADMIN_EMPRESA','GESTOR_SEGURANCA'), RiscoController.update);
router.delete('/:id', authorize('SUPER_ADMIN','ADMIN_EMPRESA'), RiscoController.remove);

module.exports = router;
